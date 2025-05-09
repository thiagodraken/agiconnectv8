import { SetMetadata } from '@nestjs/common';

export const IS_TOKEN_PROTECTED_KEY = 'tokenProtected';

export const WithTokenProtection = () =>
  SetMetadata(IS_TOKEN_PROTECTED_KEY, true);
