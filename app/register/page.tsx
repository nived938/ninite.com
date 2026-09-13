import Link from 'next/link'
import {RegisterForm} from '@/components/AuthForms'
export default function Register(){return <main className="section"><div className="container" style={{maxWidth:520}}><RegisterForm/><p className="muted" style={{textAlign:'center'}}>Already have an account? <Link href="/login" style={{color:'var(--brand)'}}>Sign in</Link></p></div></main>}
