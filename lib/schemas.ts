import {z} from 'zod';
export const weatherRequestSchema=z.object({latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180),startDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),endDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)}).refine(x=>x.startDate<=x.endDate,{message:'시작일은 종료일보다 빨라야 합니다.'});
export const geocodeSchema=z.object({results:z.array(z.object({id:z.number(),name:z.string(),country:z.string().optional().default(''),latitude:z.number(),longitude:z.number(),admin1:z.string().optional()})).optional().default([])});
