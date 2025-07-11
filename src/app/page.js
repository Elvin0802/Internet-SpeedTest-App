// "use client"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Download, Wifi, Zap } from "lucide-react"

// export default function SpeedTest() {
//   const [speed, setSpeed] = useState(0)
//   const [testing, setTesting] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [testDuration, setTestDuration] = useState(0)
//   const [maxSpeed, setMaxSpeed] = useState(0)

//   const totalBytesRef = useRef(0)
//   const startTimeRef = useRef(0)
//   const intervalRef = useRef(null)
//   const progressIntervalRef = useRef(null)

//   const startTest = async () => {
//     setTesting(true)
//     setSpeed(0)
//     setProgress(0)
//     setTestDuration(0)
//     setMaxSpeed(0)
//     totalBytesRef.current = 0
//     startTimeRef.current = Date.now()

//     // Progress animation
//     progressIntervalRef.current = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) return 100
//         return prev + 10
//       })
//     }, 1000)

//     try {
//       const response = await fetch("https://lvn-internet-speed-test.runasp.net/api/speedtest/downloadlive")
//       const reader = response.body?.getReader()

//       if (!reader) {
//         throw new Error("Failed to get response reader")
//       }

//       // Update speed every 1s.
//       intervalRef.current = setInterval(() => {
//         const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000
//         const mbps = (totalBytesRef.current * 8) / (elapsedSeconds * 1024 * 1024)
//         const currentSpeed = Number(mbps.toFixed(2))

//         setSpeed(currentSpeed)
//         setTestDuration(Number(elapsedSeconds.toFixed(1)))
//         setMaxSpeed((prev) => Math.max(prev, currentSpeed))

//       }, 1000)

//       // Read stream
//       while (true) {
//         const { done, value } = await reader.read()
//         if (done) break
//         totalBytesRef.current += value.length
//       }

//       // Clear intervals
//       if (intervalRef.current) clearInterval(intervalRef.current)
//       if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

//       // Final update
//       const totalSeconds = (Date.now() - startTimeRef.current) / 1000
//       const finalMbps = (totalBytesRef.current * 8) / (totalSeconds * 1024 * 1024)
//       const finalSpeed = Number(finalMbps.toFixed(2))

//       setSpeed(finalSpeed)
//       setTestDuration(Number(totalSeconds.toFixed(1)))
//       setMaxSpeed((prev) => Math.max(prev, finalSpeed))
//       setProgress(100)
//     } catch (err) {
//       console.error("Speed test error:", err)
//     } finally {
//       if (intervalRef.current) clearInterval(intervalRef.current)
//       if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
//       setTesting(false)
//     }
//   }

//   const getSpeedCategory = (speed) => {
//     if (speed >= 100) return { label: "Ultra Fast", color: "bg-green-500", icon: Zap }
//     if (speed >= 50) return { label: "Fast", color: "bg-blue-500", icon: Wifi }
//     if (speed >= 25) return { label: "Good", color: "bg-yellow-500", icon: Download }
//     return { label: "Slow", color: "bg-red-500", icon: Download }
//   }

//   const speedCategory = getSpeedCategory(speed)
//   const SpeedIcon = speedCategory.icon

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="text-center">
//           <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
//             <Download className="h-8 w-8 text-blue-600" />
//           </div>
//           <CardTitle className="text-2xl font-bold">Internet Speed Test</CardTitle>
//           <CardDescription>Test your download speed in real-time</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <Button onClick={startTest} disabled={testing} className="w-full h-12 text-lg font-semibold" size="lg">
//             {testing ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
//                 Testing...
//               </>
//             ) : (
//               "Start Speed Test"
//             )}
//           </Button>

//           {testing && (
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm text-muted-foreground">
//                 <span>Progress</span>
//                 <span>{progress.toFixed(0)}%</span>
//               </div>
//               <Progress value={progress} className="h-2" />
//             </div>
//           )}

//           {(testing || speed > 0) && (
//             <div className="space-y-4">
//               <div className="text-center">
//                 <div className="flex items-center justify-center gap-2 mb-2">
//                   <SpeedIcon className="h-5 w-5" />
//                   <Badge variant="secondary" className={`${speedCategory.color} text-white`}>
//                     {speedCategory.label}
//                   </Badge>
//                 </div>
//                 <div className="text-4xl font-bold font-mono text-blue-600">{speed}</div>
//                 <div className="text-lg text-muted-foreground">Mbps</div>
//               </div>

//               <Separator />

//               <div className="grid grid-cols-2 gap-4 text-center">
//                 <div>
//                   <div className="text-2xl font-bold font-mono">{maxSpeed.toFixed(2)}</div>
//                   <div className="text-sm text-muted-foreground">Peak Speed</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold font-mono">{testDuration}s</div>
//                   <div className="text-sm text-muted-foreground">Duration</div>
//                 </div>
//               </div>

//               <div className="text-center">
//                 <div className="text-lg font-semibold">{(totalBytesRef.current / (1024 * 1024)).toFixed(2)} MB</div>
//                 <div className="text-lg font-semibold">{(totalBytesRef.current / (1024 * 1024 * 1024)).toFixed(2)} GB</div>
//                 <div className="text-sm text-muted-foreground">Data Downloaded</div>
//               </div>
//             </div>
//           )}

//           {!testing && speed === 0 && (
//             <div className="text-center text-muted-foreground">
//               <p className="text-sm">
//                 Click the button above to start testing your internet speed. The test will measure your download speed
//                 in real-time.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Download, Wifi, Zap } from "lucide-react";
// import {
//   measurePing,
//   measureJitter,
//   measureDownloadLive,
//   measureUpload,
// } from "@/lib/speedtest";

// export default function Page() {
//   const [ping, setPing] = useState();
//   const [jitter, setJitter] = useState();
//   const [download, setDownload] = useState();
//   const [upload, setUpload] = useState();
//   const [testing, setTesting] = useState(false);

//   const startTest = async () => {
//     setTesting(true);
//     setPing(undefined);
//     setJitter(undefined);
//     setDownload(undefined);
//     setUpload(undefined);

//     const p = await measurePing();
//     setPing(p);

//     const j = await measureJitter(60);
//     setJitter(j);

//     const d = await measureDownloadLive(10);
//     setDownload(d);

//     const u = await measureUpload(24);
//     setUpload(u);

//     setTesting(false);
//   };

//   const getCategory = (speed) => {
//     if (speed >= 100)
//       return { label: "Ultra Fast", color: "bg-green-500", icon: Zap };
//     if (speed >= 50) return { label: "Fast", color: "bg-blue-500", icon: Wifi };
//     if (speed >= 25)
//       return { label: "Good", color: "bg-yellow-500", icon: Download };

//     return { label: "Slow", color: "bg-red-500", icon: Download };
//   };

//   const DownloadIcon = getCategory(download || 0).icon;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="max-w-md w-full shadow-xl">
//         <CardHeader className="text-center">
//           <div className="mb-4 p-3 bg-blue-100 rounded-full inline-block">
//             <Download className="h-8 w-8 text-blue-600" />
//           </div>
//           <CardTitle>Internet Speed Test</CardTitle>
//           <CardDescription>
//             Measure ping, jitter, download & upload
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <Button
//             onClick={startTest}
//             disabled={testing}
//             className="w-full h-12"
//           >
//             {testing ? "Testing..." : "Start Full Test"}
//           </Button>

//           {ping !== undefined && <div>Ping: {ping.toFixed(1)} ms</div>}
//           {jitter !== undefined && <div>Jitter: {jitter.toFixed(1)} ms</div>}

//           {download !== undefined && (
//             <>
//               <Separator />
//               <div className="text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <DownloadIcon className="h-5 w-5" />
//                   <Badge className={getCategory(download).color}>
//                     {getCategory(download).label}
//                   </Badge>
//                 </div>
//                 <div className="text-4xl font-bold font-mono">{download}</div>
//                 <div>Mbps Download</div>
//               </div>
//             </>
//           )}

//           {upload !== undefined && <div>Upload: {upload.toFixed(2)} Mbps</div>}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Wifi, Zap, Activity, Timer } from "lucide-react";
import {
  measurePing,
  measureJitter,
  measureDownloadLiveWithRealtime,
  measureUploadLiveWithRealtime,
} from "@/lib/speedtest";

export default function Page() {
  const [ping, setPing] = useState(null);
  const [jitter, setJitter] = useState(null);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [testing, setTesting] = useState(false);

  // User input states
  const [testDuration, setTestDuration] = useState(15);
  const [jitterCount, setJitterCount] = useState(30);

  const startTest = async () => {
    setTesting(true);
    setDownload(0);
    setUpload(0);
    setDownloadHistory([]);
    setUploadHistory([]);

    const p = await measurePing();
    setPing(p);

    const j = await measureJitter(jitterCount);
    setJitter(j);

    await Promise.all([
      measureDownloadLiveWithRealtime(testDuration, (mbps, sec) => {
        setDownload(mbps);
        setDownloadHistory((prev) => [...prev, { sec, mbps }]);
      }),
      measureUploadLiveWithRealtime(testDuration, (mbps, sec) => {
        setUpload(mbps);
        setUploadHistory((prev) => [...prev, { sec, mbps }]);
      }),
    ]);

    setTesting(false);
  };

  const getCategory = (speed) => {
    if (speed >= 1000)
      return {
        label: "Ultra Fast",
        color: "bg-gradient-to-r from-green-600 to-green-700",
        textColor: "text-green-700",
        icon: Zap,
      };
    if (speed >= 500)
      return {
        label: "Super Fast",
        color: "bg-gradient-to-r from-green-500 to-green-600",
        textColor: "text-green-600",
        icon: Zap,
      };
    if (speed >= 100)
      return {
        label: "Fast",
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        textColor: "text-blue-600",
        icon: Wifi,
      };
    if (speed >= 50)
      return {
        label: "Good",
        color: "bg-gradient-to-r from-blue-400 to-blue-500",
        textColor: "text-blue-500",
        icon: Wifi,
      };
    if (speed >= 25)
      return {
        label: "Normal",
        color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        textColor: "text-yellow-600",
        icon: Wifi,
      };
    if (speed >= 5)
      return {
        label: "Slow",
        color: "bg-gradient-to-r from-orange-500 to-orange-600",
        textColor: "text-orange-600",
        icon: Wifi,
      };
    return {
      label: "Very Slow",
      color: "bg-gradient-to-r from-red-500 to-red-600",
      textColor: "text-red-600",
      icon: Wifi,
    };
  };

  const downloadCategory = getCategory(download);
  const uploadCategory = getCategory(upload);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header Card - Minimized */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-fit shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Internet Speed Test
            </CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-6">
            {/* Test Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium text-slate-600"
                >
                  Test Duration (seconds)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={testDuration}
                  onChange={(e) => setTestDuration(Number(e.target.value))}
                  min="5"
                  max="60"
                  className="h-10"
                  disabled={testing}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="jitterCount"
                  className="text-sm font-medium text-slate-600"
                >
                  Jitter Count
                </Label>
                <Input
                  id="jitterCount"
                  type="number"
                  value={jitterCount}
                  onChange={(e) => setJitterCount(Number(e.target.value))}
                  min="10"
                  max="100"
                  className="h-10"
                  disabled={testing}
                />
              </div>
            </div>

            {/* Minimized Button */}
            <Button
              onClick={startTest}
              disabled={testing}
              className="w-full h-10 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
            >
              {testing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Testing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Start Test
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Metrics */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Timer className="h-5 w-5 text-slate-600" />
                Network Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {ping !== null && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-700">Ping</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-800">
                    {ping.toFixed(1)} ms
                  </span>
                </div>
              )}

              {jitter !== null && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-slate-700">Jitter</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-800">
                    {jitter.toFixed(1)} ms
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Speed Results */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wifi className="h-5 w-5 text-slate-600" />
                Speed Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Download Speed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-slate-700">Download</span>
                    <Badge
                      className={`${downloadCategory.color} text-white border-0 shadow-sm`}
                    >
                      {downloadCategory.label}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold font-mono text-slate-800">
                    {download.toFixed(2)} Mbps
                  </span>
                </div>
                <Progress
                  value={Math.min((download / 200) * 100, 100)}
                  className="h-3 bg-slate-200"
                />
              </div>

              {/* Upload Speed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-slate-700">Upload</span>
                    <Badge
                      className={`${uploadCategory.color} text-white border-0 shadow-sm`}
                    >
                      {uploadCategory.label}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold font-mono text-slate-800">
                    {upload.toFixed(2)} Mbps
                  </span>
                </div>
                <Progress
                  value={Math.min((upload / 200) * 100, 100)}
                  className="h-3 bg-slate-200"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Section - Show ALL data */}
        {(downloadHistory.length > 0 || uploadHistory.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Download History */}
            {downloadHistory.length > 0 && (
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Download className="h-5 w-5 text-green-600" />
                    Download History ({downloadHistory.length} entries)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {downloadHistory.map(({ sec, mbps }, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                      >
                        <span className="text-sm font-medium text-slate-600">
                          {sec}s
                        </span>
                        <span className="text-lg font-bold font-mono text-green-700">
                          {mbps.toFixed(2)} Mbps
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload History */}
            {uploadHistory.length > 0 && (
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Upload History ({uploadHistory.length} entries)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uploadHistory.map(({ sec, mbps }, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                      >
                        <span className="text-sm font-medium text-slate-600">
                          {sec}s
                        </span>
                        <span className="text-lg font-bold font-mono text-blue-700">
                          {mbps.toFixed(2)} Mbps
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
