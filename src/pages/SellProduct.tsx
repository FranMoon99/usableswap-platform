
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ImagePlus, Upload, Tags, DollarSign } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100, { message: "Title cannot exceed 100 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(1000, { message: "Description cannot exceed 1000 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }).max(999999, { message: "Price is too high" }),
  condition: z.string({ required_error: "Please select the item condition" }),
  location: z.string().min(3, { message: "Location is required" }).optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  images: z.any().optional(),
});

// Define the categories
const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing & Accessories' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'toys', name: 'Toys & Games' },
  { id: 'vehicles', name: 'Vehicles & Parts' },
  { id: 'books', name: 'Books & Media' },
  { id: 'other', name: 'Other' },
];

// Define the item conditions
const conditions = [
  { id: 'new', name: 'New' },
  { id: 'like_new', name: 'Like New' },
  { id: 'good', name: 'Good' },
  { id: 'fair', name: 'Fair' },
  { id: 'poor', name: 'Poor' },
];

type FormValues = z.infer<typeof formSchema>;

const SellProduct = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      condition: '',
      location: '',
      acceptTerms: false,
    },
  });

  // Handle image selection
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          setSelectedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to list a product.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically send data to your backend/API
      console.log('Form data submitted:', { ...data, images: selectedImages });
      
      // Show success message
      toast({
        title: "Product Listed Successfully",
        description: "Your product has been listed and is now visible to others.",
      });
      
      // Redirect to product page or user profile
      navigate('/profile');
    } catch (error) {
      console.error('Error listing product:', error);
      toast({
        title: "Error",
        description: "There was a problem listing your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 md:px-6 lg:pt-24">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Sell Your Item</CardTitle>
          <CardDescription>
            Fill in the details below to list your item for sale.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sony PlayStation 5 Console" {...field} />
                    </FormControl>
                    <FormDescription>
                      Create a clear and concise title that describes your item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Images */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <FormLabel>Product Images</FormLabel>
                  <div>
                    <Input 
                      id="productImages" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageSelection}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('productImages')?.click()}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Add Images
                    </Button>
                  </div>
                </div>
                
                {selectedImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                    {selectedImages.map((src, index) => (
                      <div key={index} className="relative overflow-hidden rounded-md border">
                        <AspectRatio ratio={1 / 1}>
                          <img
                            src={src}
                            alt={`Product image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2" />
                    <p className="text-sm">Drag images here or click the Add Images button above</p>
                    <p className="text-xs mt-1">Maximum 5 images, JPEG or PNG format</p>
                  </div>
                )}
              </div>

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category that best fits your item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-9"
                          {...field}
                          onChange={event => field.onChange(+event.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Condition */}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditions.map(condition => (
                          <SelectItem key={condition.id} value={condition.id}>
                            {condition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Be honest about the condition of your item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your item in detail. Include features, defects, history, etc." 
                        className="resize-none min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description that helps buyers understand your item better.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add your location to help nearby buyers find your item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Terms and Conditions</FormLabel>
                      <FormDescription>
                        I agree to the terms of service and privacy policy.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Listing Product...' : 'List Product'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellProduct;
