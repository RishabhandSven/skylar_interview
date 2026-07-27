package com.bi.service;

import com.bi.dto.InsightRequest;
import com.bi.dto.InsightResponse;

public interface LlmService {

    InsightResponse generateInsights(InsightRequest request);
}
