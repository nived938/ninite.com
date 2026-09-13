import Link from 'next/link'
import {LoginForm} from '@/components/AuthForms'
export default function Login(){return <main className="section"><div className="container" style={{maxWidth:520}}><LoginForm/><p className="muted" style={{textAlign:'center'}}>New here? <Link href="/register" style={{color:'var(--brand)'}}>Create an account</Link></p></div></main>}
