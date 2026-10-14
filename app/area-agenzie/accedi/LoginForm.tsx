"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ValidationErrors } from "@/app/data/travelPackages";
import styles from "../area.module.css";

export default function LoginForm() {
  const router = useRouter(); const [errors,setErrors]=useState<ValidationErrors>({}); const [message,setMessage]=useState(""); const [pending,setPending]=useState(false);
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setPending(true);setErrors({});setMessage("");const data=new FormData(event.currentTarget);try{const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:data.get("email"),password:data.get("password")})});const payload=await response.json();if(!response.ok){setErrors(payload.errors??{});setMessage(payload.message??"Accesso non riuscito.");return;}router.push("/pacchetti");router.refresh();}catch{setMessage("Il servizio non è raggiungibile. Riprova tra poco.");}finally{setPending(false);}};
  return <form className={styles.form} onSubmit={submit} noValidate><label className={`${styles.field} ${errors.email ? styles.fieldInvalid : ""}`}><span>Email agenzia</span><input type="email" name="email" autoComplete="email" required />{errors.email?.map((error)=><small key={error}>{error}</small>)}</label><label className={`${styles.field} ${errors.password ? styles.fieldInvalid : ""}`}><span>Password</span><input type="password" name="password" autoComplete="current-password" required />{errors.password?.map((error)=><small key={error}>{error}</small>)}</label>{message&&<div className={`${styles.message} ${styles.error}`} role="alert">{message}</div>}<button className={styles.submit} type="submit" disabled={pending}>{pending?"Accesso in corso…":"Accedi all’area agenzie"}</button></form>;
}
