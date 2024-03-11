import { NextRequest, NextResponse } from "next/server";
import getAppData from "@/actions/database/getAppData";
import getUserById from "@/actions/database/getUserById";
import updateUser from "@/actions/database/updateUser";
import { PermissionType } from "@/types/types";
import MesssagesList from "@/JsonData/MessagesList.json";


export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("user_id");
    const appId = request.nextUrl.searchParams.get("client_id");
    const appSecret = request.nextUrl.searchParams.get("client_secret");
    if (!userId || !appId || !appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo = await getAppData(appId);
    if (appSecret !== appInfo.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });
    const userData = await getUserById(userId);
    if (!userData) return NextResponse.json({ status: "error", message: MesssagesList.M020.message }, { status: MesssagesList.M020.code });
    return NextResponse.json({ status: "success", message: MesssagesList.M015.message, data: userData.permissions }, { status: MesssagesList.M015.code });
}


export async function POST(request: NextRequest) {

    const recieved = await request.json();
    const appId = recieved.client_id, appSecret = recieved.client_secret, userId = recieved.user_id, newRole = recieved.role;

    if (!appId || !appSecret || !userId || !newRole) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo = await getAppData(appId);
    if (appSecret !== appInfo.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });


    const userData = await getUserById(userId);
    if (!userData) return NextResponse.json({ status: "error", message: MesssagesList.M020.message }, { status: MesssagesList.M020.code });
    const existingPermission = userData.permissions.find(permission => permission.appId === appId);

    if (existingPermission) {
        if (existingPermission.roles.includes(newRole)) return NextResponse.json({ status: "success", message: MesssagesList.M015.message }, { status: MesssagesList.M015.code });
        existingPermission.roles.push(newRole);
    } else {
        const newPermission: PermissionType = { appId, roles: [newRole] };
        userData.permissions.push(newPermission);
    }

    await updateUser(userId, { permissions: userData.permissions });

    return NextResponse.json({ status: "success", message: MesssagesList.M015.message }, { status: MesssagesList.M015.code });
}

export async function PATCH(request: NextRequest) {
    const recieved = await request.json();
    const appId = recieved.client_id, appSecret = recieved.client_secret, userId = recieved.user_id, newRole = recieved.new_role, oldRole = recieved.old_role;

    if (!appId || !appSecret || !userId || !newRole || !oldRole) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo = await getAppData(appId);
    if (appSecret !== appInfo.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });


    const userData = await getUserById(userId);
    if (!userData) return NextResponse.json({ status: "error", message: MesssagesList.M020.message }, { status: MesssagesList.M020.code });

    const index = userData.permissions.findIndex(permission => permission.appId === appId);

    if (index !== -1) {
        const oldRoleIndex = userData.permissions[index].roles.indexOf(oldRole);
        if (oldRoleIndex !== -1) userData.permissions[index].roles.splice(oldRoleIndex, 1);
        userData.permissions[index].roles.push(newRole);

    } else {
        const newPermission = { appId, roles: [newRole] };
        userData.permissions.push(newPermission);

    }
    await updateUser(userId, { permissions: userData.permissions });

    return NextResponse.json({ status: "success", message: MesssagesList.M015.message }, { status: MesssagesList.M015.code });
}

export async function DELETE(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("user_id");
    const appId = request.nextUrl.searchParams.get("client_id");
    const appSecret = request.nextUrl.searchParams.get("client_secret");
    const oldRole = request.nextUrl.searchParams.get("role");

    if (!appId || !appSecret || !userId || !oldRole) return NextResponse.json({ status: "error", message: MesssagesList.M019.message }, { status: MesssagesList.M019.code });
    const appInfo = await getAppData(appId);
    if (appSecret !== appInfo.appSecret) return NextResponse.json({ status: "error", message: MesssagesList.M002.message }, { status: MesssagesList.M002.code });


    const userData = await getUserById(userId);
    if (!userData) return NextResponse.json({ status: "error", message: MesssagesList.M020.message }, { status: MesssagesList.M020.code });

    const index = userData.permissions.findIndex(permission => permission.appId === appId);

    if (index !== -1) {
        const roleIndex = userData.permissions[index].roles.indexOf(oldRole);

        if (roleIndex !== -1) {
            userData.permissions[index].roles.splice(roleIndex, 1);

            if (userData.permissions[index].roles.length === 0) {
                userData.permissions.splice(index, 1);
            }
        }
    }

    await updateUser(userId, { permissions: userData.permissions });

    return NextResponse.json({ status: "success", message: MesssagesList.M015.message }, { status: MesssagesList.M015.code });
}

