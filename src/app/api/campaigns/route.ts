import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, CampaignRecord } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const allCampaigns = await DatabaseService.getAllCampaigns()
    return NextResponse.json(allCampaigns)
  } catch (error) {
    console.error('Campaigns GET error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const campaignData: CampaignRecord = await request.json()

    // Validate required fields
    if (!campaignData.name || !campaignData.platforms || campaignData.platforms.length === 0) {
      return NextResponse.json(
        { error: 'Campaign name and at least one platform are required' },
        { status: 400 }
      )
    }

    const savedCampaign = await DatabaseService.saveCampaign(campaignData)
    if (!savedCampaign) {
      throw new Error('Failed to save campaign to database')
    }

    return NextResponse.json(savedCampaign)
  } catch (error) {
    console.error('Campaign POST error:', error)
    return NextResponse.json(
      { error: 'Failed to save campaign' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    const campaignData: Partial<CampaignRecord> = await request.json()
    const updatedCampaign = await DatabaseService.updateCampaign(id, campaignData)

    if (!updatedCampaign) {
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedCampaign)
  } catch (error) {
    console.error('Campaign PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    const deleted = await DatabaseService.deleteCampaign(id)
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Campaign DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
