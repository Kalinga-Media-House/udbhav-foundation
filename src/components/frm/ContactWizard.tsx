'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronRight, UserPlus, Building, Tags, FileText, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Simplified schema for the wizard to bypass some strict rules while drafting
const wizardSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  gender: z.string().optional(),
  contact_type_ids: z.array(z.string()).default([]),
  organization_id: z.string().optional(),
  designation: z.string().optional(),
  tag_ids: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: UserPlus },
  { id: 'type', title: 'Contact Type', icon: Tags },
  { id: 'organization', title: 'Organization', icon: Building },
  { id: 'tags', title: 'Tags & Attributes', icon: Tags },
  { id: 'notes', title: 'Internal Notes', icon: FileText },
];

export function ContactWizard({ contactTypes: _c = [], tags: _t = [], organizations: _o = [] }: any) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      contact_type_ids: [],
      tag_ids: [],
      organization_id: '',
      designation: '',
      notes: '',
    },
    mode: 'onTouched',
  });

  const { handleSubmit, formState: { errors }, trigger, register, setValue, watch } = methods;

  const handleNext = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof WizardFormData)[] = [];
    
    if (currentStep === 0) fieldsToValidate = ['full_name', 'email', 'phone'];
    else if (currentStep === 1) fieldsToValidate = ['contact_type_ids'];
    else if (currentStep === 2) fieldsToValidate = ['organization_id', 'designation'];
    else if (currentStep === 3) fieldsToValidate = ['tag_ids'];

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (_data: WizardFormData) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would call the createContactAction
      // await createContactAction(data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push('/admin/dashboard/relationships');
      router.refresh();
    } catch (error) {
      console.error('Failed to create contact', error);
      setIsSubmitting(false);
    }
  };

  const StepIcon = STEPS[currentStep].icon;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Wizard Header / Stepper */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto hide-scrollbar">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          
          return (
            <div 
              key={step.id} 
              className={`flex items-center px-6 py-4 relative flex-1 min-w-[150px] ${
                isCurrent ? 'bg-white dark:bg-zinc-950 border-b-2 border-b-primary text-primary' : 'text-zinc-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                isCompleted ? 'bg-primary text-primary-foreground' : 
                isCurrent ? 'bg-primary/20 text-primary' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
              {index < STEPS.length - 1 && (
                <ChevronRight className="absolute right-0 w-4 h-4 text-zinc-300 dark:text-zinc-700" />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
            <StepIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{STEPS[currentStep].title}</h2>
            <p className="text-sm text-zinc-500">Provide the necessary details for this contact.</p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Step 1: Basic Info */}
            <div className={currentStep === 0 ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="full_name" 
                    placeholder="Enter full name" 
                    {...register('full_name')} 
                    className={errors.full_name ? 'border-red-500' : ''}
                  />
                  {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="name@example.com" 
                    {...register('email')} 
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 98765 43210" 
                    {...register('phone')} 
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Contact Type */}
            <div className={currentStep === 1 ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Volunteer', 'Donor', 'Partner', 'Beneficiary', 'Media', 'Government', 'Vendor', 'Other'].map((type) => (
                  <div 
                    key={type}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      watch('contact_type_ids').includes(type) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                    onClick={() => {
                      const current = watch('contact_type_ids');
                      if (current.includes(type)) {
                        setValue('contact_type_ids', current.filter(t => t !== type), { shouldValidate: true });
                      } else {
                        setValue('contact_type_ids', [...current, type], { shouldValidate: true });
                      }
                    }}
                  >
                    <Checkbox checked={watch('contact_type_ids').includes(type)} />
                    <Label className="cursor-pointer font-medium text-base">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Organization */}
            <div className={currentStep === 2 ? 'block' : 'hidden'}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Link Organization (Optional)</Label>
                  <Select onValueChange={(val: string) => setValue('organization_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org-1">Global Health Partners</SelectItem>
                      <SelectItem value="org-2">Tech For Good</SelectItem>
                      <SelectItem value="org-3">Ministry of Education</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-zinc-500">Leave blank if this contact is not associated with an organization.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation / Role</Label>
                  <Input 
                    id="designation" 
                    placeholder="e.g. Director of Operations" 
                    {...register('designation')} 
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Tags */}
            <div className={currentStep === 3 ? 'block' : 'hidden'}>
              <p className="text-sm text-zinc-500 mb-4">Select all applicable attributes to help categorize this contact.</p>
              <div className="flex flex-wrap gap-2">
                {['Event Speaker', 'High Net Worth', 'Medical Professional', 'Teacher', 'Local Resident', 'Available Weekends'].map((tag) => {
                  const isSelected = watch('tag_ids').includes(tag);
                  return (
                    <div 
                      key={tag}
                      onClick={() => {
                        const current = watch('tag_ids');
                        if (isSelected) setValue('tag_ids', current.filter(t => t !== tag));
                        else setValue('tag_ids', [...current, tag]);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors border ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Notes */}
            <div className={currentStep === 4 ? 'block' : 'hidden'}>
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Remarks</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add any internal notes, context, or instructions regarding this contact..." 
                  className="min-h-[150px]"
                  {...register('notes')} 
                />
                <p className="text-xs text-zinc-500">These notes are only visible to administrators.</p>
              </div>
            </div>

            {/* Wizard Controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {currentStep < STEPS.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Creating...' : 'Create Contact'}
                  {!isSubmitting && <Save className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
