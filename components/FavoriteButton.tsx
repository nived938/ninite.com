'use client'
import {useState} from 'react'

export default function FavoriteButton({applicationId,initialFavorite=false}:{applicationId:string;initialFavorite?:boolean}){
 const [favorite,setFavorite]=useState(initialFavorite); const [busy,setBusy]=useState(false)
 async function toggle(){setBusy(true); const r=await fetch('/api/favorites',{method:favorite?'DELETE':'POST',headers:{'content-type':'application/json'},body:JSON.stringify({applicationId})}); const d=await r.json().catch(()=>({})); setBusy(false); if(r.ok)setFavorite(Boolean(d.favorite)); else if(r.status===401) window.location.href='/login?callbackUrl='+encodeURIComponent(window.location.pathname)}
 return <button className="btn ghost" disabled={busy} onClick={toggle}>{busy?'Saving...':favorite?'★ Favorited':'☆ Add to favorites'}</button>
}
