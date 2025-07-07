import AzureADProvider from 'next-auth/providers/azure-ad'
import { v4 as uuidv4 } from 'uuid'

interface AzureAuthConfig {
  clientId: string
  clientSecret: string
  tenantId: string
  scope: string
}

export const AZURE_CONFIG: AzureAuthConfig = {
  clientId: process.env.AZURE_AD_CLIENT_ID || 'dummy-client-id',
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET || 'dummy-client-secret',
  tenantId: process.env.AZURE_AD_TENANT_ID || 'dummy-tenant-id',
  scope: `openid profile email ${process.env.AZURE_AD_CLIENT_ID || 'dummy-client-id'}/.default`,
}

export const configureAzureProvider = (config: AzureAuthConfig) => {
  return AzureADProvider({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    tenantId: config.tenantId,
    authorization: {
      params: {
        response_type: 'code',
        prompt: 'select_account',
        scope: config.scope,
        state: uuidv4(),
      },
    },
  })
}
