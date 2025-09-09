import { SetMetadata } from "@nestjs/common";

// This decorator is used to mark routes as public, meaning they do not require authentication.
// It can be used to allow access to certain endpoints without the need for a JWT token.
export const Public = () => SetMetadata('isPublic', true);