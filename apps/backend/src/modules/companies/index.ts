import { Elysia, t } from 'elysia';
import { CompanyService } from './service';

const companyService = new CompanyService();

// Plugin Companies avec toutes les routes
export const companiesModule = new Elysia({ 
  prefix: '/companies',
  name: 'companies', // Important pour la déduplication
  tags: ['Companies'] // Pour la doc OpenAPI
})
  // GET all companies avec filtres
  .get('/', async ({ query }) => {
    const companies = await companyService.getAllCompanies({
      companyType: query.type,
      sector: query.sector,
      city: query.city,
      postalCode: query.postalCode,
      search: query.search,
    });
    
    const count = companies.length;
    
    return {
      success: true,
      count,
      data: companies,
    };
  }, {
    detail: {
      summary: 'Get all companies',
      description: 'Retrieve all companies with optional filters',
      tags: ['Companies']
    },
    query: t.Object({
      type: t.Optional(t.String({ description: 'Filter by company type' })),
      sector: t.Optional(t.String({ description: 'Filter by sector' })),
      city: t.Optional(t.String({ description: 'Filter by city' })),
      postalCode: t.Optional(t.String({ description: 'Filter by postal code' })),
      search: t.Optional(t.String({ description: 'Search in name and description' })),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        count: t.Number(),
        data: t.Array(t.Any()),
      })
    }
  })
  
  // GET company by ID
  .get('/:id', async ({ params: { id }, error }) => {
    const company = await companyService.getCompanyById(id);
    
    if (!company) {
      return error(404, {
        success: false,
        message: 'Company not found',
      });
    }
    
    return {
      success: true,
      data: company,
    };
  }, {
    detail: {
      summary: 'Get company by ID',
      tags: ['Companies']
    },
    params: t.Object({
      id: t.String({ format: 'uuid', description: 'Company UUID' })
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Any(),
      }),
      404: t.Object({
        success: t.Boolean(),
        message: t.String(),
      })
    }
  })
  
  // GET company by SIRET
  .get('/siret/:siret', async ({ params: { siret }, error }) => {
    const company = await companyService.getCompanyBySiret(siret);
    
    if (!company) {
      return error(404, {
        success: false,
        message: 'Company not found',
      });
    }
    
    return {
      success: true,
      data: company,
    };
  }, {
    detail: {
      summary: 'Get company by SIRET',
      tags: ['Companies']
    },
    params: t.Object({
      siret: t.String({ minLength: 14, maxLength: 14 })
    })
  })
  
  // POST create company
  .post('/', async ({ body }) => {
    const company = await companyService.createCompany(body);
    
    return {
      success: true,
      message: 'Company created successfully',
      data: company,
    };
  }, {
    detail: {
      summary: 'Create a new company',
      tags: ['Companies']
    },
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 255 }),
      siret: t.Optional(t.String({ minLength: 14, maxLength: 14 })),
      siren: t.Optional(t.String({ minLength: 9, maxLength: 9 })),
      naf: t.Optional(t.String()),
      companyType: t.Optional(t.String()),
      sector: t.Optional(t.String()),
      address: t.Optional(t.String()),
      postalCode: t.Optional(t.String({ pattern: '^[0-9]{5}$' })),
      city: t.Optional(t.String()),
      latitude: t.Optional(t.String()),
      longitude: t.Optional(t.String()),
      website: t.Optional(t.String({ format: 'uri' })),
      email: t.Optional(t.String({ format: 'email' })),
      phone: t.Optional(t.String()),
      description: t.Optional(t.String()),
      employees: t.Optional(t.String()),
      foundedYear: t.Optional(t.String({ pattern: '^[0-9]{4}$' })),
      technologies: t.Optional(t.String()),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        message: t.String(),
        data: t.Any(),
      })
    }
  })
  
  // PUT update company
  .put('/:id', async ({ params: { id }, body, error }) => {
    const company = await companyService.updateCompany(id, body);
    
    if (!company) {
      return error(404, {
        success: false,
        message: 'Company not found',
      });
    }
    
    return {
      success: true,
      message: 'Company updated successfully',
      data: company,
    };
  }, {
    detail: {
      summary: 'Update a company',
      tags: ['Companies']
    },
    params: t.Object({
      id: t.String({ format: 'uuid' })
    }),
    body: t.Partial(t.Object({
      name: t.String(),
      companyType: t.String(),
      sector: t.String(),
      address: t.String(),
      city: t.String(),
      postalCode: t.String(),
      latitude: t.String(),
      longitude: t.String(),
      website: t.String(),
      email: t.String(),
      phone: t.String(),
      description: t.String(),
      employees: t.String(),
      foundedYear: t.String(),
      technologies: t.String(),
    }))
  })
  
  // DELETE company
  .delete('/:id', async ({ params: { id }, error }) => {
    const deleted = await companyService.deleteCompany(id);
    
    if (!deleted) {
      return error(404, {
        success: false,
        message: 'Company not found',
      });
    }
    
    return {
      success: true,
      message: 'Company deleted successfully',
    };
  }, {
    detail: {
      summary: 'Delete a company',
      tags: ['Companies']
    },
    params: t.Object({
      id: t.String({ format: 'uuid' })
    })
  })
  
  // GET companies statistics
  .get('/stats/count', async ({ query }) => {
    const count = await companyService.countCompanies({
      companyType: query.type,
      sector: query.sector,
      city: query.city,
    });
    
    return {
      success: true,
      count,
    };
  }, {
    detail: {
      summary: 'Get companies count',
      tags: ['Companies', 'Statistics']
    },
    query: t.Object({
      type: t.Optional(t.String()),
      sector: t.Optional(t.String()),
      city: t.Optional(t.String()),
    })
  })
  
  // GET companies in radius
  .get('/nearby/:lat/:lng', async ({ params: { lat, lng }, query }) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radius = query.radius ? parseFloat(query.radius) : 10; // 10km par défaut
    
    const companies = await companyService.getCompaniesInRadius(
      latitude,
      longitude,
      radius
    );
    
    return {
      success: true,
      count: companies.length,
      radius,
      data: companies,
    };
  }, {
    detail: {
      summary: 'Get companies within radius',
      description: 'Find companies within a specified radius from coordinates',
      tags: ['Companies', 'Geolocation']
    },
    params: t.Object({
      lat: t.String({ description: 'Latitude' }),
      lng: t.String({ description: 'Longitude' }),
    }),
    query: t.Object({
      radius: t.Optional(t.String({ description: 'Radius in kilometers (default: 10)' })),
    })
  });
