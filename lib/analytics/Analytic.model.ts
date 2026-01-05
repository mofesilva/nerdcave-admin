import { DeviceType, EventType, TargetType } from "../../types/Analytic.types";

export type Analytic = {
    _id: string;
    targetId: string;
    targetType: TargetType;
    type: EventType;
    sessionId?: string;
    userAgent?: string;
    referrer?: string;
    city?: string;
    state?: string;
    country?: string;
    device?: DeviceType;
    consentGiven: boolean;
    deleted: boolean;
}