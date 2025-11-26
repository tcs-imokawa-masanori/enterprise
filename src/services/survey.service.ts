/**
 * Survey Service
 * Handles EA Maturity Survey data management, invitation sending, and response collection
 */

export interface SurveyQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  scores: number[];
}

export interface SurveyResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  responses: { [key: string]: number };
  completedAt: Date;
  status: 'completed' | 'pending';
}

export interface SurveyInvitation {
  id: string;
  email: string;
  name: string;
  sentAt: Date;
  status: 'pending' | 'completed';
  completedAt?: Date;
  surveyLink?: string;
}

export interface RadarChartData {
  category: string;
  value: number;
  fullMark: number;
}

class SurveyService {
  private readonly STORAGE_KEYS = {
    RESPONSES: 'ea-survey-responses',
    INVITATIONS: 'ea-survey-invitations',
    QUESTIONS: 'ea-survey-questions'
  };

  /**
   * Get all survey responses from localStorage
   */
  getResponses(): SurveyResponse[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.RESPONSES);
    if (!data) return [];
    
    const responses = JSON.parse(data);
    // Convert date strings back to Date objects
    return responses.map((r: any) => ({
      ...r,
      completedAt: new Date(r.completedAt)
    }));
  }

  /**
   * Save a survey response
   */
  saveResponse(response: SurveyResponse): void {
    const responses = this.getResponses();
    responses.push(response);
    localStorage.setItem(this.STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
  }

  /**
   * Update an existing survey response
   */
  updateResponse(id: string, updates: Partial<SurveyResponse>): void {
    const responses = this.getResponses();
    const index = responses.findIndex(r => r.id === id);
    if (index !== -1) {
      responses[index] = { ...responses[index], ...updates };
      localStorage.setItem(this.STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
    }
  }

  /**
   * Delete a survey response
   */
  deleteResponse(id: string): void {
    const responses = this.getResponses();
    const filtered = responses.filter(r => r.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.RESPONSES, JSON.stringify(filtered));
  }

  /**
   * Get all survey invitations
   */
  getInvitations(): SurveyInvitation[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.INVITATIONS);
    if (!data) return [];
    
    const invitations = JSON.parse(data);
    // Convert date strings back to Date objects
    return invitations.map((i: any) => ({
      ...i,
      sentAt: new Date(i.sentAt),
      completedAt: i.completedAt ? new Date(i.completedAt) : undefined
    }));
  }

  /**
   * Save a survey invitation
   */
  saveInvitation(invitation: SurveyInvitation): void {
    const invitations = this.getInvitations();
    invitations.push(invitation);
    localStorage.setItem(this.STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
  }

  /**
   * Update an existing invitation
   */
  updateInvitation(id: string, updates: Partial<SurveyInvitation>): void {
    const invitations = this.getInvitations();
    const index = invitations.findIndex(i => i.id === id);
    if (index !== -1) {
      invitations[index] = { ...invitations[index], ...updates };
      localStorage.setItem(this.STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
    }
  }

  /**
   * Delete an invitation
   */
  deleteInvitation(id: string): void {
    const invitations = this.getInvitations();
    const filtered = invitations.filter(i => i.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.INVITATIONS, JSON.stringify(filtered));
  }

  /**
   * Generate a unique survey link for an invitation
   */
  generateSurveyLink(invitationId: string): string {
    return `${window.location.origin}/survey/${invitationId}`;
  }

  /**
   * Send survey invitation via email
   * In a production environment, this would call a backend API
   */
  async sendInvitation(email: string, name: string): Promise<SurveyInvitation> {
    const invitation: SurveyInvitation = {
      id: Date.now().toString(),
      email,
      name,
      sentAt: new Date(),
      status: 'pending',
      surveyLink: ''
    };

    invitation.surveyLink = this.generateSurveyLink(invitation.id);
    this.saveInvitation(invitation);

    // In production, this would send an actual email
    // For now, we'll simulate the email sending
    console.log(`Survey invitation sent to ${email}`);
    console.log(`Survey link: ${invitation.surveyLink}`);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return invitation;
  }

  /**
   * Calculate radar chart data from survey responses
   */
  calculateRadarData(
    responses: { [key: string]: number },
    questions: SurveyQuestion[]
  ): RadarChartData[] {
    const categories: { [key: string]: { total: number; count: number } } = {};
    
    questions.forEach(q => {
      if (responses[q.id] !== undefined) {
        if (!categories[q.category]) {
          categories[q.category] = { total: 0, count: 0 };
        }
        categories[q.category].total += responses[q.id];
        categories[q.category].count += 1;
      }
    });

    return Object.keys(categories).map(category => ({
      category: category,
      value: categories[category].count > 0 
        ? Math.round((categories[category].total / categories[category].count) * 10) / 10 
        : 0,
      fullMark: 5
    }));
  }

  /**
   * Calculate aggregate radar data from multiple responses
   */
  calculateAggregateRadarData(
    responses: SurveyResponse[],
    questions: SurveyQuestion[]
  ): RadarChartData[] {
    if (responses.length === 0) return [];

    const aggregated: { [key: string]: number } = {};
    
    responses.forEach(resp => {
      Object.keys(resp.responses).forEach(key => {
        aggregated[key] = (aggregated[key] || 0) + resp.responses[key];
      });
    });

    // Average the scores
    Object.keys(aggregated).forEach(key => {
      aggregated[key] = aggregated[key] / responses.length;
    });

    return this.calculateRadarData(aggregated, questions);
  }

  /**
   * Export survey response to JSON
   */
  exportResponseToJSON(response: SurveyResponse): string {
    return JSON.stringify(response, null, 2);
  }

  /**
   * Export all responses to CSV
   */
  exportResponsesToCSV(responses: SurveyResponse[], questions: SurveyQuestion[]): string {
    const headers = ['User Name', 'Email', 'Completed At', ...questions.map(q => q.category)];
    const rows = responses.map(r => {
      const radarData = this.calculateRadarData(r.responses, questions);
      return [
        r.userName,
        r.userEmail,
        r.completedAt.toISOString(),
        ...radarData.map(d => d.value.toString())
      ];
    });

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }

  /**
   * Calculate completion rate
   */
  getCompletionRate(): number {
    const invitations = this.getInvitations();
    if (invitations.length === 0) return 0;
    
    const completed = invitations.filter(i => i.status === 'completed').length;
    return Math.round((completed / invitations.length) * 100);
  }

  /**
   * Get survey statistics
   */
  getStatistics() {
    const responses = this.getResponses();
    const invitations = this.getInvitations();

    return {
      totalResponses: responses.length,
      totalInvitations: invitations.length,
      completionRate: this.getCompletionRate(),
      pendingInvitations: invitations.filter(i => i.status === 'pending').length,
      averageCompletionTime: this.calculateAverageCompletionTime(responses)
    };
  }

  /**
   * Calculate average time to complete survey
   */
  private calculateAverageCompletionTime(responses: SurveyResponse[]): number {
    // This would require tracking when survey was started
    // For now, return a placeholder
    return 0;
  }

  /**
   * Clear all survey data
   */
  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.RESPONSES);
    localStorage.removeItem(this.STORAGE_KEYS.INVITATIONS);
  }
}

// Export singleton instance
export const surveyService = new SurveyService();




