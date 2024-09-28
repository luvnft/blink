import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function VerifyRequestPage() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>A sign in link has been sent to your email address.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          If you don't see it, check your spam folder. If you still don't see it, try requesting a new link.
        </p>
      </CardContent>
    </Card>
  )
}