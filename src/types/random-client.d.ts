interface RandomRequest {
  id: string;
  status: string;
  random_value?: number;
  timestamp: number;
  requester_id?: string;
}

interface GetRandomRequestsResponse {
  request_id?: string;
  requests?: RandomRequest[];
  value?: number;
  entropy?: number;
  error?: string;
}

interface RandomClient {
  createRequest(providerIds: string[], requestedInputs?: number, callbackId?: string): Promise<string>;
  getRandomRequests(requestIds: string[]): Promise<GetRandomRequestsResponse>;
  getAllProviderActivity(): Promise<ProviderActivity[]>;
  getRandomRequestViaCallbackId?(callbackId: string): Promise<GetRandomRequestsResponse>;
}

interface ProviderActivity {
  provider_id: string;
  active_challenge_requests?: {
    request_ids: string[];
  };
  active_output_requests?: {
    request_ids: string[];
  };
}
