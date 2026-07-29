import fs from 'fs';
import path from 'path';

const basePath = 'c:/Projects/udbhav-foundation/src/features/contacts';

// 2. Patch repository.ts
let repoContent = fs.readFileSync(path.join(basePath, 'repository.ts'), 'utf-8');

const repoMethods = `
  // Contact Types CRUD
  async listContactTypes(): Promise<RepositoryResult<ContactTypeRow[]>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('contact_types').select('*').order('display_order', { ascending: true });
      if (error) return { data: null, error: error.message };
      return { data: data as ContactTypeRow[], error: null };
    } catch (err: any) {
      serverLogger.error('Failed to list contact types', err);
      return { data: null, error: 'Database error' };
    }
  }

  async createContactType(data: ContactTypeCreate): Promise<RepositoryResult<ContactTypeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: created, error } = await supabase.from('contact_types').insert(data).select().single();
      if (error) return { data: null, error: error.message };
      return { data: created as ContactTypeRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to create contact type', err);
      return { data: null, error: 'Database error' };
    }
  }

  async updateContactType(id: ID, data: Partial<ContactTypeCreate>): Promise<RepositoryResult<ContactTypeRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: updated, error } = await supabase.from('contact_types').update(data).eq('id', id).select().single();
      if (error) return { data: null, error: error.message };
      return { data: updated as ContactTypeRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to update contact type', err);
      return { data: null, error: 'Database error' };
    }
  }

  // Tags CRUD
  async listTags(): Promise<RepositoryResult<TagRow[]>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('tags').select('*').order('display_order', { ascending: true });
      if (error) return { data: null, error: error.message };
      return { data: data as TagRow[], error: null };
    } catch (err: any) {
      serverLogger.error('Failed to list tags', err);
      return { data: null, error: 'Database error' };
    }
  }

  async createTag(data: TagCreate): Promise<RepositoryResult<TagRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: created, error } = await supabase.from('tags').insert(data).select().single();
      if (error) return { data: null, error: error.message };
      return { data: created as TagRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to create tag', err);
      return { data: null, error: 'Database error' };
    }
  }

  async updateTag(id: ID, data: Partial<TagCreate>): Promise<RepositoryResult<TagRow>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: updated, error } = await supabase.from('tags').update(data).eq('id', id).select().single();
      if (error) return { data: null, error: error.message };
      return { data: updated as TagRow, error: null };
    } catch (err: any) {
      serverLogger.error('Failed to update tag', err);
      return { data: null, error: 'Database error' };
    }
  }

  // Interactions Global List
  async listInteractions(params: { pagination: Pagination, filters?: Record<string, unknown> }): Promise<RepositoryResult<PaginatedResult<ContactInteractionRow>>> {
    try {
      const supabase = await createServerSupabaseClient();
      const { pagination, filters } = params;
      let query = supabase.from('contact_interactions').select('*, contacts!inner(full_name, contact_number)', { count: 'exact' });
      
      const { page, limit } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query.order('interaction_date', { ascending: false }).range(from, to);
      
      const { data, error, count } = await query;
      if (error) return { data: null, error: error.message };
      
      return {
        data: {
          data: data as any[],
          meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) }
        },
        error: null
      };
    } catch (err: any) {
      serverLogger.error('Failed to list interactions', err);
      return { data: null, error: 'Database error' };
    }
  }
}

export const contactsRepository = new ContactsRepository();
`;
repoContent = repoContent.replace("}\n\nexport const contactsRepository = new ContactsRepository();", repoMethods).replace("}\r\n\r\nexport const contactsRepository = new ContactsRepository();", repoMethods).replace("}\nexport const contactsRepository = new ContactsRepository();", repoMethods).replace("}\r\nexport const contactsRepository = new ContactsRepository();", repoMethods);
fs.writeFileSync(path.join(basePath, 'repository.ts'), repoContent);


// 3. Patch service.ts
let serviceContent = fs.readFileSync(path.join(basePath, 'service.ts'), 'utf-8');
const serviceMethods = `
  // Contact Types
  async listContactTypes(): Promise<ServiceResult<ContactTypeRow[]>> {
    return fromRepo(await contactsRepository.listContactTypes());
  }
  
  async createContactType(dto: CreateContactTypeDTO): Promise<ServiceResult<ContactTypeRow>> {
    const parsed = createContactTypeSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.createContactType(parsed.data));
  }

  async updateContactType(id: ID, dto: UpdateContactTypeDTO): Promise<ServiceResult<ContactTypeRow>> {
    const parsed = updateContactTypeSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.updateContactType(id, parsed.data));
  }

  // Tags
  async listTags(): Promise<ServiceResult<TagRow[]>> {
    return fromRepo(await contactsRepository.listTags());
  }

  async createTag(dto: CreateTagDTO): Promise<ServiceResult<TagRow>> {
    const parsed = createTagSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.createTag(parsed.data));
  }

  async updateTag(id: ID, dto: UpdateTagDTO): Promise<ServiceResult<TagRow>> {
    const parsed = updateTagSchema.safeParse(dto);
    if (!parsed.success) return fail(parsed.error.issues.map((e: any) => e.message).join(', '));
    return fromRepo(await contactsRepository.updateTag(id, parsed.data));
  }

  // Interactions Global
  async listInteractions(pagination: Pagination, filters?: Record<string, unknown>): Promise<ServiceResult<PaginatedResult<ContactInteractionRow>>> {
    return fromRepo(await contactsRepository.listInteractions({ pagination, filters }));
  }
}

export const contactsService = new ContactsService();
`;
serviceContent = serviceContent.replace("}\n\nexport const contactsService = new ContactsService();", serviceMethods).replace("}\r\n\r\nexport const contactsService = new ContactsService();", serviceMethods).replace("}\nexport const contactsService = new ContactsService();", serviceMethods).replace("}\r\nexport const contactsService = new ContactsService();", serviceMethods);
fs.writeFileSync(path.join(basePath, 'service.ts'), serviceContent);

console.log('Backend properly patched!');
