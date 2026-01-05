export type AnalyticsConsent = {
    granted: boolean;
    grantedAt?: Date;
    revokedAt?: Date;
};

export type UserInformations = {
    analyticsConsent?: AnalyticsConsent;
    // Adicionar outros campos conforme necessário
};
