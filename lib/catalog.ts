import { db } from '@/lib/db'
import { License } from '@prisma/client'

const categoryNames = ['Web Browsers','Messaging','Email','Media Players','Audio','Video','Image Editing','Photography','3D & CAD','Design','Office','PDF','Notes','Cloud Storage','Backup','Compression','Security','Privacy','Password Managers','Developer Tools','IDEs','Programming Languages','Git','Databases','API Tools','Containers','Virtualization','Networking','Remote Access','System Utilities','Terminal','AI Tools','Machine Learning','Education','Science','Finance','Gaming','Game Launchers','Streaming','Screen Recording','Video Conferencing','Productivity','Project Management','Accessibility','Open Source']

type CatalogApp = { name:string; slug:string; description:string; website:string; license:License; openSource:boolean }

const apps: CatalogApp[] = [
 ['Firefox','mozilla-firefox','Fast, private and open web browser.','https://www.mozilla.org/firefox/',License.OPEN_SOURCE,true],
 ['Chrome','google-chrome','A fast browser built by Google.','https://www.google.com/chrome/',License.FREE,false],
 ['Brave','brave','Privacy-first browser with built-in protections.','https://brave.com/download/',License.FREE,true],
 ['Vivaldi','vivaldi','Powerful browser for people who want control.','https://vivaldi.com/download/',License.FREE,false],
 ['Microsoft Edge','microsoft-edge','Modern Chromium browser from Microsoft.','https://www.microsoft.com/edge',License.FREE,false],
 ['Discord','discord','Voice, video and community communication.','https://discord.com/download',License.FREEMIUM,false],
 ['Signal','signal','Private messaging with end-to-end encryption.','https://signal.org/download/',License.OPEN_SOURCE,true],
 ['Thunderbird','thunderbird','Open-source email and calendar client.','https://www.thunderbird.net/',License.OPEN_SOURCE,true],
 ['VLC','vlc','Cross-platform media player for almost any format.','https://www.videolan.org/vlc/',License.OPEN_SOURCE,true],
 ['Spotify','spotify','Music, podcasts and audio streaming client.','https://www.spotify.com/download/windows/',License.FREEMIUM,false],
 ['HandBrake','handbrake','Open-source video transcoder.','https://handbrake.fr/',License.OPEN_SOURCE,true],
 ['OBS Studio','obs-studio','Open-source recording and live streaming software.','https://obsproject.com/',License.OPEN_SOURCE,true],
 ['GIMP','gimp','Powerful open-source image editor.','https://www.gimp.org/downloads/',License.OPEN_SOURCE,true],
 ['Krita','krita','Professional open-source painting application.','https://krita.org/en/download/',License.OPEN_SOURCE,true],
 ['Blender','blender','3D creation suite for modeling, animation and rendering.','https://www.blender.org/download/',License.OPEN_SOURCE,true],
 ['Inkscape','inkscape','Open-source vector graphics editor.','https://inkscape.org/release/',License.OPEN_SOURCE,true],
 ['LibreOffice','libreoffice','Full office suite for documents, sheets and presentations.','https://www.libreoffice.org/download/download/',License.OPEN_SOURCE,true],
 ['7-Zip','7zip','High-compression file archiver.','https://www.7-zip.org/',License.OPEN_SOURCE,true],
 ['Bitwarden','bitwarden','Open-source password manager.','https://bitwarden.com/download/',License.FREEMIUM,true],
 ['KeePassXC','keepassxc','Secure offline password manager.','https://keepassxc.org/download/',License.OPEN_SOURCE,true],
 ['Git','git','Distributed version control system.','https://git-scm.com/download/win',License.OPEN_SOURCE,true],
 ['GitHub Desktop','github-desktop','GitHub workflow made simple on the desktop.','https://desktop.github.com/',License.OPEN_SOURCE,true],
 ['Visual Studio Code','visual-studio-code','Extensible source code editor with terminal and Git support.','https://code.visualstudio.com/download',License.FREE,false],
 ['Visual Studio','visual-studio','Integrated development environment for .NET and C++.','https://visualstudio.microsoft.com/downloads/',License.FREEMIUM,false],
 ['JetBrains Toolbox','jetbrains-toolbox','Manage JetBrains developer tools in one place.','https://www.jetbrains.com/toolbox-app/',License.FREEMIUM,false],
 ['Node.js','nodejs','JavaScript runtime for server and tooling.','https://nodejs.org/en/download',License.OPEN_SOURCE,true],
 ['Python','python','General-purpose programming language.','https://www.python.org/downloads/windows/',License.OPEN_SOURCE,true],
 ['Rust','rust','Reliable language for systems programming.','https://www.rust-lang.org/tools/install',License.OPEN_SOURCE,true],
 ['Go','go','Fast, simple language from Google.','https://go.dev/dl/',License.OPEN_SOURCE,true],
 ['Docker Desktop','docker-desktop','Container development environment for Windows.','https://www.docker.com/products/docker-desktop/',License.FREEMIUM,false],
 ['Postman','postman','API development and testing platform.','https://www.postman.com/downloads/',License.FREEMIUM,false],
 ['Insomnia','insomnia','Open-source API client.','https://insomnia.rest/download',License.OPEN_SOURCE,true],
 ['DBeaver','dbeaver','Universal database management tool.','https://dbeaver.io/download/',License.OPEN_SOURCE,true],
 ['Ollama','ollama','Run large language models locally.','https://ollama.com/download/windows',License.OPEN_SOURCE,true],
 ['LM Studio','lm-studio','Desktop environment for running local AI models.','https://lmstudio.ai/',License.FREEMIUM,false],
 ['Steam','steam','PC game store and launcher.','https://store.steampowered.com/about/',License.FREE,false],
 ['Epic Games Launcher','epic-games','Game launcher and store from Epic Games.','https://store.epicgames.com/en-US/download',License.FREE,false],
 ['GOG Galaxy','gog-galaxy','Game library and launcher from GOG.','https://www.gog.com/galaxy',License.FREE,false],
 ['7-Zip ZS','7zip-zs','Community build of 7-Zip with modern compression features.','https://github.com/mcmilk/7-Zip-zstd',License.OPEN_SOURCE,true],
 ['VirtualBox','virtualbox','Open-source virtualization platform.','https://www.virtualbox.org/wiki/Downloads',License.OPEN_SOURCE,true],
 ['RustDesk','rustdesk','Open-source remote desktop software.','https://rustdesk.com/download/',License.OPEN_SOURCE,true],
 ['PowerToys','powertoys','Windows utilities for power users.','https://learn.microsoft.com/windows/powertoys/',License.OPEN_SOURCE,true],
 ['Everything','everything','Fast filename search for Windows.','https://www.voidtools.com/',License.FREE,false],
 ['Audacity','audacity','Open-source audio recording and editing.','https://www.audacityteam.org/download/windows/',License.OPEN_SOURCE,true],
 ['Notepad++','notepad-plus-plus','Lightweight source code and text editor.','https://notepad-plus-plus.org/downloads/',License.OPEN_SOURCE,true],
 ['qBittorrent','qbittorrent','Open-source BitTorrent client.','https://www.qbittorrent.org/download',License.OPEN_SOURCE,true],
 ['Proton VPN','proton-vpn','Privacy-focused VPN client.','https://protonvpn.com/download-windows',License.FREEMIUM,false],
].map(([name,slug,description,website,license,openSource]) => ({name,slug,description,website,license,openSource} as CatalogApp))

function publisherName(name:string) {
 if (name === 'Firefox') return 'Mozilla'
 if (name === 'Chrome') return 'Google'
 if (name === 'VLC') return 'VideoLAN'
 if (name === 'Blender') return 'Blender Foundation'
 if (name === 'GitHub Desktop') return 'GitHub'
 if (name === 'Visual Studio Code' || name === 'Visual Studio' || name === 'PowerToys') return 'Microsoft'
 return name
}

function categoryFor(name:string) {
 if (/Firefox|Chrome|Brave|Vivaldi|Edge/.test(name)) return 'Web Browsers'
 if (/Discord|Signal/.test(name)) return 'Messaging'
 if (/Thunderbird/.test(name)) return 'Email'
 if (/VLC|Spotify/.test(name)) return 'Media Players'
 if (/GIMP|Krita/.test(name)) return 'Image Editing'
 if (/Blender/.test(name)) return '3D & CAD'
 if (/LibreOffice/.test(name)) return 'Office'
 if (/7-Zip/.test(name)) return 'Compression'
 if (/Bitwarden|KeePassXC/.test(name)) return 'Password Managers'
 if (/Git|GitHub Desktop/.test(name)) return 'Git'
 if (/Visual Studio|JetBrains|Node|Python|Rust|Go|Docker|Postman|Insomnia|DBeaver/.test(name)) return 'Developer Tools'
 if (/Ollama|LM Studio/.test(name)) return 'AI Tools'
 if (/Steam|Epic|GOG/.test(name)) return 'Gaming'
 if (/VirtualBox/.test(name)) return 'Virtualization'
 if (/RustDesk/.test(name)) return 'Remote Access'
 if (/PowerToys|Everything/.test(name)) return 'System Utilities'
 if (/Audacity/.test(name)) return 'Audio'
 if (/Notepad/.test(name)) return 'Productivity'
 if (/qBittorrent/.test(name)) return 'Networking'
 if (/Proton/.test(name)) return 'Privacy'
 return 'Open Source'
}

export async function ensureCatalog() {
 const existing = await db.application.count()
 if (existing > 0) return existing

 const categoryMap = new Map<string,string>()
 for (const name of categoryNames) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'-')
  const category = await db.category.upsert({where:{slug},update:{},create:{name,slug}})
  categoryMap.set(name,category.id)
 }

 for (const item of apps) {
  const publisher = await db.publisher.upsert({where:{name:publisherName(item.name)},update:{website:item.website},create:{name:publisherName(item.name),website:item.website,verified:false}})
  let iconUrl = ''
  try { iconUrl = new URL('/favicon.ico',item.website).toString() } catch {}
  const app = await db.application.upsert({
   where:{slug:item.slug},
   update:{description:item.description,websiteUrl:item.website,sourceUrl:item.website,iconUrl,license:item.license,openSource:item.openSource,publisherId:publisher.id,active:true},
   create:{slug:item.slug,name:item.name,description:item.description,websiteUrl:item.website,sourceUrl:item.website,iconUrl,license:item.license,openSource:item.openSource,publisherId:publisher.id,active:true}
  })
  const categoryId = categoryMap.get(categoryFor(item.name))!
  await db.applicationCategory.upsert({where:{applicationId_categoryId:{applicationId:app.id,categoryId}},update:{},create:{applicationId:app.id,categoryId}})
 }
 return apps.length
}
