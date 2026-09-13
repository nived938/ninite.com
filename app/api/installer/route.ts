import { NextResponse } from 'next/server'
import { createHash, createHmac, randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { z } from 'zod'

const input = z.object({
  applicationIds: z.array(z.string()).min(1).max(100),
  options: z.object({ skip: z.boolean(), shortcuts: z.boolean(), currentUser: z.boolean(), silent: z.boolean() }),
})

export async function POST(req: Request) {
  try {
    const body = input.parse(await req.json())
    if (!process.env.INSTALLER_SIGNING_SECRET) {
      return NextResponse.json({ error: 'Installer signing is not configured.' }, { status: 503 })
    }

    const apps = await db.application.findMany({
      where: { id: { in: body.applicationIds }, active: true },
      include: { publisher: true, versions: { where: { current: true }, take: 1 } },
    })

    if (apps.length !== body.applicationIds.length) {
      return NextResponse.json({ error: 'One or more applications are unavailable.' }, { status: 400 })
    }

    const missing = apps.filter(app => {
      const version = app.versions[0]
      return !version || !version.verified || !version.downloadUrl || !version.checksum || !version.signature
    })

    if (missing.length) {
      return NextResponse.json({
        error: 'Installer generation is temporarily unavailable for one or more selected apps.',
        code: 'RELEASE_VERIFICATION_REQUIRED',
        missing: missing.map(app => ({
          id: app.id,
          name: app.name,
          publisher: app.publisher.name,
          officialUrl: app.sourceUrl ?? app.websiteUrl,
        })),
        message: 'AppNest only builds installers from releases that have been verified with an official download URL, SHA-256 checksum, and signature metadata.',
      }, { status: 409 })
    }

    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    const config = {
      schemaVersion: 1,
      product: 'AppNest',
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      options: body.options,
      items: apps.map((app, index) => {
        const version = app.versions[0]
        return {
          position: index,
          appId: app.id,
          name: app.name,
          publisher: app.publisher.name,
          version: version.version,
          architecture: version.architecture,
          platform: version.platform,
          downloadUrl: version.downloadUrl,
          sha256: version.checksum,
          signature: version.signature,
        }
      }),
    }

    const payload = JSON.stringify(config)
    const configHash = createHash('sha256').update(payload).digest('hex')
    const manifestSignature = createHmac('sha256', process.env.INSTALLER_SIGNING_SECRET).update(payload).digest('base64url')
    const installer = await db.installer.create({
      data: {
        token,
        configHash,
        expiresAt,
        items: { create: apps.map((app, index) => ({ applicationId: app.id, versionId: app.versions[0].id, position: index })) },
      },
    })

    return NextResponse.json({ installerId: installer.id, token, configHash, manifestSignature, config })
  } catch (error) {
    return NextResponse.json({ error: error instanceof z.ZodError ? 'Invalid installer request.' : 'Unable to create installer configuration.' }, { status: 400 })
  }
}
