"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import FirstScreen from "@/components/FirstScreen"
import QuestionScreen from "@/components/QuestionScreen"
import BalloonsScreen from "@/components/BalloonsScreen"
import PhotoScreen from "@/components/PhotoScreen"
import FinalScreen from "@/components/FinalScreen"
import CuteLoader from "@/components/CuteLoader"

export default function ProposalSite() {
  const [currentScreen, setCurrentScreen] = useState("loader")
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    // Background music setup
    const audio = new Audio("/audio/bg.mp3")
    audio.loop = true
    audioRef.current = audio

    const playAudio = async () => {
      try {
        await audio.play()
      } catch {
        // Autoplay might be blocked; will try again on first user interaction
      }
    }

    playAudio()

    const timer = setTimeout(() => {
      setIsLoading(false)
      setCurrentScreen("first")
    }, 3000)
    return () => {
      clearTimeout(timer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  const nextScreen = (screen) => {
    setCurrentScreen(screen)
  }

  const handleUserInteraction = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => { })
    }
  }

  return (
    <div className="romantic-bg" onClick={handleUserInteraction}>

      {/* Animated hearts + glow orb background */}
      <div className="romantic-bg-hearts" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="romantic-heart" />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading && <CuteLoader key="loader" onComplete={() => setCurrentScreen("first")} />}

        {currentScreen === "first" && <FirstScreen key="first" onNext={() => nextScreen("question1")} />}

        {currentScreen === "question1" && (
          <QuestionScreen
            key="question1"
            question="Do you like surprises?"
            onYes={() => nextScreen("question2")}
            isFirst={true}
          />
        )}

        {currentScreen === "question2" && (
          <QuestionScreen
            key="question2"
            question="Do you like me?"
            onYes={() => nextScreen("balloons")}
            isFirst={false}
          />
        )}

        {currentScreen === "balloons" && <BalloonsScreen key="balloons" onNext={() => nextScreen("photos")} />}

        {currentScreen === "photos" && <PhotoScreen key="photos" onNext={() => nextScreen("final")} />}

        {currentScreen === "final" && <FinalScreen key="final" />}
      </AnimatePresence>
    </div>
  )
}
