import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { redirect } from "next/navigation"
import { FederalHeader } from "@/components/federal-header"
import { PortalFooter } from "@/components/portal-footer"
import { BrandingForm } from "@/components/admin/branding-form"

type BrandingAsset = {
  id: string
  name: string
  image_url: string
  placement: string
  alt_text: string | null
  created_at: string
}

type BrandingConfig = {
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

export const metadata = {
  title: "Branding | Admin",
  description: "Manage portal branding",
}

export default async function AdminBrandingPage() {
  const session = await getSession()
  if (!session || session.role !== "admin") redirect("/login")
  const sql = getDb()

  const configs = await sql`
    SELECT bc.*, 
      lh.name as landing_hero_name, lh.image_url as landing_hero_url,
      ab.name as auth_bg_name, ab.image_url as auth_bg_url,
      ub.name as user_bg_name, ub.image_url as user_bg_url,
      adb.name as admin_bg_name, adb.image_url as admin_bg_url,
      ht.name as header_texture_name, ht.image_url as header_texture_url
    FROM branding_config bc
    LEFT JOIN branding_assets lh ON bc.landing_hero_asset_id = lh.id
    LEFT JOIN branding_assets ab ON bc.auth_bg_asset_id = ab.id
    LEFT JOIN branding_assets ub ON bc.user_bg_asset_id = ub.id
    LEFT JOIN branding_assets adb ON bc.admin_bg_asset_id = adb.id
    LEFT JOIN branding_assets ht ON bc.header_texture_asset_id = ht.id
    LIMIT 1
  `
  const config = (configs.length > 0 ? configs[0] : null) as BrandingConfig | null

  const assets = (await sql`
    SELECT * FROM branding_assets ORDER BY created_at DESC
  `) as BrandingAsset[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FederalHeader user={session} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Portal Branding
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage branding assets and configuration
          </p>
        </div>
        <BrandingForm config={config} assets={assets} />
      </main>
      <PortalFooter />
    </div>
  )
}
