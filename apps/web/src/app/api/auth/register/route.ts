import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    return NextResponse.json({ error: 'Public registration is disabled' }, { status: 403 });
}
