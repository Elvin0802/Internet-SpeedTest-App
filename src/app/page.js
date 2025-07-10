"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Wifi, Zap } from "lucide-react"

export default function SpeedTest() {
  const [speed, setSpeed] = useState(0)
  const [testing, setTesting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [testDuration, setTestDuration] = useState(0)
  const [maxSpeed, setMaxSpeed] = useState(0)

  const totalBytesRef = useRef(0)
  const startTimeRef = useRef(0)
  const intervalRef = useRef(null)
  const progressIntervalRef = useRef(null)

  const startTest = async () => {
    setTesting(true)
    setSpeed(0)
    setProgress(0)
    setTestDuration(0)
    setMaxSpeed(0)
    totalBytesRef.current = 0
    startTimeRef.current = Date.now()

    // Progress animation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 10
      })
    }, 1000)

    try {
      const response = await fetch("https://lvn-internet-speed-test.runasp.net/api/speedtest/downloadlive")
      const reader = response.body?.getReader()

      if (!reader) {
        throw new Error("Failed to get response reader")
      }

      // Update speed every 1s.
      intervalRef.current = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000
        const mbps = (totalBytesRef.current * 8) / (elapsedSeconds * 1024 * 1024)
        const currentSpeed = Number(mbps.toFixed(2))

        setSpeed(currentSpeed)
        setTestDuration(Number(elapsedSeconds.toFixed(1)))
        setMaxSpeed((prev) => Math.max(prev, currentSpeed))

      }, 1000)

      // Read stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        totalBytesRef.current += value.length
      }

      // Clear intervals
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

      // Final update
      const totalSeconds = (Date.now() - startTimeRef.current) / 1000
      const finalMbps = (totalBytesRef.current * 8) / (totalSeconds * 1024 * 1024)
      const finalSpeed = Number(finalMbps.toFixed(2))

      setSpeed(finalSpeed)
      setTestDuration(Number(totalSeconds.toFixed(1)))
      setMaxSpeed((prev) => Math.max(prev, finalSpeed))
      setProgress(100)
    } catch (err) {
      console.error("Speed test error:", err)
    } finally {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      setTesting(false)
    }
  }

  const getSpeedCategory = (speed) => {
    if (speed >= 100) return { label: "Ultra Fast", color: "bg-green-500", icon: Zap }
    if (speed >= 50) return { label: "Fast", color: "bg-blue-500", icon: Wifi }
    if (speed >= 25) return { label: "Good", color: "bg-yellow-500", icon: Download }
    return { label: "Slow", color: "bg-red-500", icon: Download }
  }

  const speedCategory = getSpeedCategory(speed)
  const SpeedIcon = speedCategory.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Download className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Internet Speed Test</CardTitle>
          <CardDescription>Test your download speed in real-time</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button onClick={startTest} disabled={testing} className="w-full h-12 text-lg font-semibold" size="lg">
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Testing...
              </>
            ) : (
              "Start Speed Test"
            )}
          </Button>

          {testing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {(testing || speed > 0) && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <SpeedIcon className="h-5 w-5" />
                  <Badge variant="secondary" className={`${speedCategory.color} text-white`}>
                    {speedCategory.label}
                  </Badge>
                </div>
                <div className="text-4xl font-bold font-mono text-blue-600">{speed}</div>
                <div className="text-lg text-muted-foreground">Mbps</div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold font-mono">{maxSpeed.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Peak Speed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono">{testDuration}s</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-semibold">{(totalBytesRef.current / (1024 * 1024)).toFixed(2)} MB</div>
                <div className="text-lg font-semibold">{(totalBytesRef.current / (1024 * 1024 * 1024)).toFixed(2)} GB</div>
                <div className="text-sm text-muted-foreground">Data Downloaded</div>
              </div>
            </div>
          )}

          {!testing && speed === 0 && (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">
                Click the button above to start testing your internet speed. The test will measure your download speed
                in real-time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
