import z from "zod/v3";

// {
//   "title": "Kebakaran Hutan",
//   "description": "Kebakaran Hutan lurr",
//   "city": "purwokerto",
//   "street": "Jalan Jenderal Sudirman",
//   "lat": -7.4243772,
//   "lng": 109.2301616,
//   "is_anon": false,
//   "attachment": [
//     {
//       "media_url": "disaster_media/2026-09-01-00:12:18.954951153-3136c8e1-bc17-4221-824d-68695e526ea0",
//       "media_type":"image"
//     },
//     {
//       "media_url": "disaster_media/2026-09-01-00:13:50.982447537-8479c50f-9499-4528-9239-3c61170515c1",
//       "media_type":"video"

//     }
//   ]
// }

export const createDisasterSchema = z.object({});

export type CreateDisasterSchemaType = z.infer<typeof createDisasterSchema>;
