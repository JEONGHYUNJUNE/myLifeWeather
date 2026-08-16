export type AnalyticsEvent='test_started'|'birthdate_completed'|'residence_added'|'analysis_started'|'analysis_completed'|'analysis_failed'|'result_viewed'|'share_card_generated'|'share_clicked'|'image_downloaded';
export function track(event:AnalyticsEvent,meta:Record<string,string|number|boolean>={}){if(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED==='true')console.info('[analytics]',event,meta)}
