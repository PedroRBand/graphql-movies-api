export const checkRole = (user: any, allowedRoles: string[] = []) => {
    if(!user) {
        throw new Error('Authentication required.')
    }

    if(!allowedRoles.includes(user.role)) {
        throw new Error('You do not have permission to perform this action.')
    }
}