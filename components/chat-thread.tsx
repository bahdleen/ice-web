"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { sendMessage } from "@/app/actions/cases"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Send, Lock, Eye, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  sender_name: string | null
  sender_role: string
  body: string
  is_internal_note: boolean
  created_at: string
  sender_user_id: string | null
  image_url?: string | null
}

type ChatThreadProps = {
  caseUuid: string
  casePublicId: string
  caseStatus: string
  participantCount: number
  messages: Message[]
  currentUserId: string
  isAdmin: boolean
}

export function ChatThread({
  caseUuid,
  casePublicId,
  caseStatus,
  participantCount,
  messages,
  currentUserId,
  isAdmin,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [isInternal, setIsInternal] = useState(false)
  const [liveMessages, setLiveMessages] = useState(messages)
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setLiveMessages(messages)
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [liveMessages])

  const refreshMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/cases/${encodeURIComponent(casePublicId)}/messages`, {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) return
      const data = (await response.json()) as { messages?: Message[] }
      if (Array.isArray(data.messages)) {
        setLiveMessages(data.messages)
      }
    } catch {
      // Keep current messages if polling fails.
    }
  }, [casePublicId])

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshMessages()
    }, 3000)

    return () => {
      window.clearInterval(timer)
    }
  }, [refreshMessages])

  const isClosed = caseStatus === "Closed"
  const canSend = isAdmin ? participantCount > 0 : !isClosed

  async function handleSend(formData: FormData) {
    setSending(true)
    formData.set("case_id", caseUuid)
    formData.set("is_internal", isInternal.toString())
    const res = await sendMessage(formData)
    if (res.error) {
      toast.error(res.error)
    } else {
      formRef.current?.reset()
      setSelectedImageName(null)
      setIsInternal(false)
      await refreshMessages()
      router.refresh()
    }
    setSending(false)
  }

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col px-4 py-6">
      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 pb-6">
        {liveMessages.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation.
          </div>
        )}

        {liveMessages.map((msg) => {
          const isOwn = msg.sender_user_id === currentUserId
          const imageOnly = msg.image_url && msg.body === "[Image attachment]"
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md rounded-md border px-4 py-3 ${
                  msg.is_internal_note
                    ? "border-accent/30 bg-accent/10"
                    : isOwn
                      ? "border-primary/30 bg-primary/10"
                      : "border-border bg-card"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-xs">
                  <span className="font-medium text-foreground">
                    {msg.sender_name || "System"}
                  </span>
                  <span className="capitalize text-muted-foreground">
                    {msg.sender_role}
                  </span>
                  {msg.is_internal_note && (
                    <span className="flex items-center gap-0.5 text-accent">
                      <Eye className="h-3 w-3" /> Internal
                    </span>
                  )}
                </div>
                {msg.image_url && (
                  <a href={msg.image_url} target="_blank" rel="noreferrer" className="mb-2 block">
                    <img
                      src={msg.image_url}
                      alt="Chat attachment"
                      className="max-h-72 w-full rounded border border-border object-cover"
                    />
                  </a>
                )}
                {!imageOnly && <p className="text-sm leading-relaxed text-foreground">{msg.body}</p>}
                <span className="mt-1 block text-right text-[10px] text-muted-foreground">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {canSend ? (
        <form ref={formRef} action={handleSend} className="border-t border-border pt-4">
          <div className="flex flex-col gap-3">
            <Textarea
              name="body"
              placeholder="Type your message (or send an image)..."
              rows={3}
              className="resize-none"
            />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="chat_image" className="text-xs text-muted-foreground">
                Attach image (optional)
              </Label>
              <input
                id="chat_image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImageName(e.target.files?.[0]?.name || null)}
                className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded file:border file:border-border file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-secondary/80"
              />
              {selectedImageName && (
                <p className="text-xs text-muted-foreground">
                  <ImageIcon className="mr-1 inline h-3 w-3" />
                  {selectedImageName}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="internal"
                    checked={isInternal}
                    onCheckedChange={(c) => setIsInternal(c === true)}
                  />
                  <Label htmlFor="internal" className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" /> Internal note (hidden from users)
                  </Label>
                </div>
              )}
              <Button type="submit" disabled={sending} className="ml-auto gap-2">
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          {isAdmin
            ? "No participant on this case yet. Admin replies are disabled until someone is added."
            : "This case is closed. Messaging is disabled."}
        </div>
      )}
    </div>
  )
}
