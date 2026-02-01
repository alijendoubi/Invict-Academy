"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
                <p className="text-gray-400">Manage staff and platform users</p>
            </div>

            <Card className="bg-[#0B1020] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Coming Soon</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400">
                    User management tools will appear here.
                </CardContent>
            </Card>
        </div>
    )
}
