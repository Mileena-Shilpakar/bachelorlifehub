'use client'

import { HeroSection } from "./components/landing/hero-section";
import { FeaturesSection } from "./components/landing/features-section";
import { CTASection } from "./components/landing/cta-section";
import { Footer } from "./components/landing/footer";
import { MainNav } from "./components/layout/main-nav";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [loading,setLoading] = useState(true)
  const router = useRouter()

  useEffect(()=>{
    const fetchUser = async()=>{
      try{
        const response = await axios.get('http://localhost:8000/api/user/profile/',{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('task-token')}`
          }
        })
        if(response.data){
          router.push('/dashboard')
        }
      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    fetchUser()
  },[])

  if (loading){
    return(
      <div>Loading</div>
    )
  }
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav showAuthButtons={true} />
      <main className="flex-1 mx-9">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
