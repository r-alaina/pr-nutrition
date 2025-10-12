import type { CollectionConfig } from 'payload'
export const Customers: CollectionConfig = {  
  slug: 'customers',
  auth: {  
	  tokenExpiration: 12 * 60 * 60,  
	  verify: true,
	  cookies: {  
		  secure: true,  
		  sameSite: 'None',  
		  domain: process.env.COOKIE_DOMAIN,  
		  },
	  },
  admin: {  
    useAsTitle: 'firstName',  
},  
access: {  
  create: () => true,
  admin: () => false,  
},
  fields: [  
  {  
    type: 'row',  
    fields: [  
      {  
        name: 'firstName',  
        type: 'text',  
      },  
      {  
        name: 'lastName',  
        type: 'text',  
      },  
    ],  
  },  
  {  
    name: 'tier',  
    type: 'radio',  
    interfaceName: 'tierProps',  
    options: [  
      'Free',  
      'Basic',  
      'Pro',  
      'Enterprise',  
    ],  
    defaultValue: 'Free',  
  },  
],
}