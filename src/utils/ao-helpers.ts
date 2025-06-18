import { RandomClient as SDKRandomClient } from 'ao-js-sdk';

class RandomClientWrapper implements RandomClient {
  private client: SDKRandomClient;

  constructor(client: SDKRandomClient) {
    this.client = client;
  }

  async createRequest(providerIds: string[], requestedInputs?: number, callbackId?: string): Promise<string> {
    const response = await this.client.createRequest(providerIds, requestedInputs, callbackId);
    console.log('Create request response:', response);
    
    // For now, generate a unique ID based on timestamp
    const requestId = `request-${Date.now()}`;
    return requestId;
  }

  async getRandomRequests(requestIds: string[]): Promise<GetRandomRequestsResponse> {
    const response = await this.client.getRandomRequests(requestIds);
    return response as unknown as GetRandomRequestsResponse;
  }

  async getAllProviderActivity(): Promise<ProviderActivity[]> {
    return this.client.getAllProviderActivity();
  }
}

export const aoHelpers = {
  getRandomClient: async (): Promise<RandomClient> => {
    try {
      const sdkClient = await SDKRandomClient.autoConfiguration();
      return new RandomClientWrapper(sdkClient);
    } catch (error) {
      console.error('Error getting random client:', error);
      throw error;
    }
  },
};
