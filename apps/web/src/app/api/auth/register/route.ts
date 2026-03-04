import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    return NextResponse.json({ error: 'Public registration is disabled' }, { status: 403 });
}
