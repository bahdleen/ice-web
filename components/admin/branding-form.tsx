"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Image as ImageIcon } from "lucide-react"

interface BrandingAsset {
  id: string
  name: string
  image_url: string
  placement: string
  alt_text: string | null
  created_at: string
}

interface BrandingConfig {
  id: string
  is_active: boolean
  landing_hero_name: string | null
  landing_hero_url: string | null
  auth_bg_name: string | null
  auth_bg_url: string | null
  user_bg_name: string | null
  user_bg_url: string | null
  admin_bg_name: string | null
  admin_bg_url: string | null
  header_texture_name: string | null
  header_texture_url: string | null
}

export function BrandingForm({
  config,
  assets,
}: {
  config: BrandingConfig | null
  assets: BrandingAsset[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5" />
            Branding Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {config ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Status:</span>
                <Badge variant={config.is_active ? "default" : "outline"}>
                  {config.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Landing Hero</p>
                  <p className="font-medium">{config.landing_hero_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Auth Background</p>
                  <p className="font-medium">{config.auth_bg_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">User Background</p>
                  <p className="font-medium">{config.user_bg_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Admin Background</p>
                  <p className="font-medium">{config.admin_bg_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Header Texture</p>
                  <p className="font-medium">{config.header_texture_name || "Not set"}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No branding configuration found. Assets can be uploaded and configured here.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-5 w-5" />
            Branding Assets ({assets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No branding assets uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {asset.image_url ? (
                      <img
                        src={asset.image_url}
                        alt={asset.alt_text || asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{asset.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {asset.placement}
                    </Badge>
                    {asset.alt_text && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {asset.alt_text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
