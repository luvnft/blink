"use client"

import { motion } from 'framer-motion'
import GenerateKeypairs from "@/components/generate-keypairs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function IntegratePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-8"
    >
      <Card className="bg-background shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Generate Blink</CardTitle>
          <CardDescription>Create and manage your Blink keypairs securely</CardDescription>
        </CardHeader>
        <CardContent>
          <GenerateKeypairs />
        </CardContent>
      </Card>
    </motion.div>
  )
}