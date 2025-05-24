"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Globe, Map, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { queryKeys } from "@/lib/queries";
import {
  Country,
  State,
  City,
  getAllCountries,
  getAllStates,
  addCountry,
  updateCountry,
  addState,
  updateState,
  addCity,
  updateCity,
  getCitiesByCountryAndState,
  LocationsListResponse,
} from "@/api/locations";

// Form Schemas
const countrySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Country name must be at least 2 characters" }),
  code: z
    .string()
    .min(2, { message: "Country code must be at least 2 characters" }),
  active: z.boolean().default(true),
});

const stateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "State name must be at least 2 characters" }),
  country: z.string().min(1, { message: "Please select a country" }),
  active: z.boolean().default(true),
});

const citySchema = z.object({
  name: z
    .string()
    .min(2, { message: "City name must be at least 2 characters" }),
  state: z.string().min(1, { message: "Please select a state" }),
  country: z.string().min(1, { message: "Please select a country" }),
  active: z.boolean().default(true),
});

// Form value types
type CountryFormValues = z.infer<typeof countrySchema>;
type StateFormValues = z.infer<typeof stateSchema>;
type CityFormValues = z.infer<typeof citySchema>;

export default function LocationsPage() {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("countries");
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [isStateDialogOpen, setIsStateDialogOpen] = useState(false);
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingState, setEditingState] = useState<State | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedCountryForStates, setSelectedCountryForStates] = useState<
    string | null
  >(null);
  const [selectedCountryForCities, setSelectedCountryForCities] = useState<
    string | null
  >(null);
  const [selectedStateForCities, setSelectedStateForCities] = useState<
    string | null
  >(null);

  // Queries
  const { data: countriesResponse, isPending: isLoadingCountries } = useQuery({
    queryKey: queryKeys.locations.countries,
    queryFn: () => getAllCountries(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  const { data: statesResponse, isPending: isLoadingStates } = useQuery({
    queryKey: queryKeys.locations.states,
    queryFn: () => getAllStates(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });

  // Replace the cities query with this properly typed version:
  const {
    data: citiesResponse,
    isPending: isLoadingCities,
    isFetching: isFetchingCities,
  } = useQuery<LocationsListResponse<City>>({
    queryKey: [
      queryKeys.locations.cities,
      selectedCountryForCities,
      selectedStateForCities,
    ],
    queryFn: async () => {
      if (selectedCountryForCities && selectedStateForCities) {
        return await getCitiesByCountryAndState(
          selectedCountryForCities,
          selectedStateForCities
        );
      }
      // Return empty array with proper structure when filters aren't both set
      return {
        statusCode: 200,
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        message: "No filters selected",
      };
    },
    enabled:
      status === "authenticated" &&
      !!selectedCountryForCities &&
      !!selectedStateForCities,
    staleTime: 5 * 60 * 1000,
  });

  // Mutations
  const addCountryMutation = useMutation({
    mutationFn: addCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.locations.countries,
      });
      toast.success("Country added successfully");
      setIsCountryDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to add country");
      console.error(error);
    },
  });

  const updateCountryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CountryFormValues>;
    }) => updateCountry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.locations.countries,
      });
      toast.success("Country updated successfully");
      setIsCountryDialogOpen(false);
      setEditingCountry(null);
    },
    onError: (error) => {
      toast.error("Failed to update country");
      console.error(error);
    },
  });

  const addStateMutation = useMutation({
    mutationFn: addState,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.locations.states,
      });
      toast.success("State added successfully");
      setIsStateDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to add state");
      console.error(error);
    },
  });

  const updateStateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<StateFormValues>;
    }) => updateState(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.locations.states,
      });
      toast.success("State updated successfully");
      setIsStateDialogOpen(false);
      setEditingState(null);
    },
    onError: (error) => {
      toast.error("Failed to update state");
      console.error(error);
    },
  });

  const addCityMutation = useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.locations.cities,
      });
      toast.success("City added successfully");
      setIsCityDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to add city");
      console.error(error);
    },
  });

  const updateCityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CityFormValues> }) =>
      updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.locations.cities,
      });
      toast.success("City updated successfully");
      setIsCityDialogOpen(false);
      setEditingCity(null);
    },
    onError: (error) => {
      toast.error("Failed to update city");
      console.error(error);
    },
  });

  // Forms
  const countryForm = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: "",
      code: "",
      active: true,
    },
  });

  const stateForm = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      name: "",
      country: "",
      active: true,
    },
  });

  const cityForm = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      state: "",
      country: "",
      active: true,
    },
  });

  // Country handlers
  const handleOpenCountryDialog = (country?: Country) => {
    if (country) {
      setEditingCountry(country);
      countryForm.reset({
        name: country.name,
        code: country.code,
        active: country.active,
      });
    } else {
      setEditingCountry(null);
      countryForm.reset({
        name: "",
        code: "",
        active: true,
      });
    }
    setIsCountryDialogOpen(true);
  };

  const onCountrySubmit = (values: CountryFormValues) => {
    if (editingCountry) {
      updateCountryMutation.mutate({ id: editingCountry._id, data: values });
    } else {
      addCountryMutation.mutate(values);
    }
  };

  // State handlers
  const handleOpenStateDialog = (state?: State) => {
    if (state) {
      setEditingState(state);
      const countryId =
        typeof state.country === "string" ? state.country : state.country._id;
      stateForm.reset({
        name: state.name,
        country: countryId,
        active: state.active,
      });
    } else {
      setEditingState(null);
      stateForm.reset({
        name: "",
        country: selectedCountryForStates || "",
        active: true,
      });
    }
    setIsStateDialogOpen(true);
  };

  const onStateSubmit = (values: StateFormValues) => {
    if (editingState) {
      updateStateMutation.mutate({ id: editingState._id, data: values });
    } else {
      addStateMutation.mutate(values);
    }
  };

  // City handlers
  const handleOpenCityDialog = (city?: City) => {
    if (city) {
      setEditingCity(city);
      const stateId =
        typeof city.state === "string" ? city.state : city.state._id;
      const countryId =
        typeof city.country === "string" ? city.country : city.country._id;
      cityForm.reset({
        name: city.name,
        state: stateId,
        country: countryId,
        active: city.active,
      });
    } else {
      setEditingCity(null);
      cityForm.reset({
        name: "",
        state: selectedStateForCities || "",
        country: selectedCountryForCities || "",
        active: true,
      });
    }
    setIsCityDialogOpen(true);
  };

  const onCitySubmit = (values: CityFormValues) => {
    if (editingCity) {
      updateCityMutation.mutate({ id: editingCity._id, data: values });
    } else {
      addCityMutation.mutate(values);
    }
  };

  // Handle country selection for states filtering
  const handleCountryChangeForStates = (countryId: string) => {
    setSelectedCountryForStates(countryId);
  };

  // Handle country and state selection for cities filtering
  const handleCountryChangeForCities = (countryId: string) => {
    setSelectedCountryForCities(countryId);
    setSelectedStateForCities(null); // Reset state when country changes
    cityForm.setValue("state", ""); // Clear the state field in the form
  };

  const handleStateChangeForCities = (stateId: string) => {
    setSelectedStateForCities(stateId);
  };

  // Filter states based on selected country
  const filteredStates = selectedCountryForStates
    ? statesResponse?.data.filter((state) => {
        const countryId =
          typeof state.country === "string" ? state.country : state.country._id;
        return countryId === selectedCountryForStates;
      })
    : statesResponse?.data;

  // Loading state
  if (isLoadingCountries && isLoadingStates && isLoadingCities) {
    return <div>Loading locations data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Location Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="countries"
            className="flex flex-col gap-3 cursor-pointer"
          >
            <Globe className="mx-auto h-4 w-4" />
            Countries
          </TabsTrigger>
          <TabsTrigger
            value="states"
            className="flex flex-col gap-3 cursor-pointer"
          >
            <Map className="mx-auto h-4 w-4" />
            States
          </TabsTrigger>
          <TabsTrigger
            value="cities"
            className="flex flex-col gap-3 cursor-pointer"
          >
            <Building className="mx-auto h-4 w-4" />
            Cities
          </TabsTrigger>
        </TabsList>

        {/* Countries Tab */}
        <TabsContent value="countries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Countries</CardTitle>
                <CardDescription>
                  Manage supported countries in your platform
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenCountryDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Country
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search countries..."
                    className="w-full pl-8"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {countriesResponse?.data.map((country) => (
                      <TableRow key={country._id}>
                        <TableCell className="font-medium">
                          {country.name}
                        </TableCell>
                        <TableCell>{country.code}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              country.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            } border-none`}
                          >
                            {country.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenCountryDialog(country)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* States Tab */}
        <TabsContent value="states">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>States</CardTitle>
                <CardDescription>
                  Manage states/provinces in your platform
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenStateDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add State
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search states..."
                    className="w-full pl-8"
                  />
                </div>
                <Select
                  onValueChange={handleCountryChangeForStates}
                  value={selectedCountryForStates || undefined}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesResponse?.data.map((country) => (
                      <SelectItem key={country._id} value={country._id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStates?.map((state) => (
                      <TableRow key={state._id}>
                        <TableCell className="font-medium">
                          {state.name}
                        </TableCell>
                        <TableCell>
                          {typeof state.country === "string"
                            ? countriesResponse?.data.find(
                                (c) => c._id === state.country
                              )?.name || state.country
                            : state.country.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              state.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            } border-none`}
                          >
                            {state.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenStateDialog(state)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cities Tab */}
        <TabsContent value="cities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Cities</CardTitle>
                <CardDescription>
                  Manage cities in your platform
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenCityDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add City
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search cities..."
                    className="w-full pl-8"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Select
                    onValueChange={handleCountryChangeForCities}
                    value={selectedCountryForCities || undefined}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countriesResponse?.data.map((country) => (
                        <SelectItem key={country._id} value={country._id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={handleStateChangeForCities}
                    value={selectedStateForCities || undefined}
                    disabled={!selectedCountryForCities}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                      {statesResponse?.data
                        .filter((state) => {
                          const countryId =
                            typeof state.country === "string"
                              ? state.country
                              : state.country._id;
                          return selectedCountryForCities
                            ? countryId === selectedCountryForCities
                            : true;
                        })
                        .map((state) => (
                          <SelectItem key={state._id} value={state._id}>
                            {state.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFetchingCities ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Loading cities...
                        </TableCell>
                      </TableRow>
                    ) : citiesResponse?.data?.length ? (
                      citiesResponse.data.map((city) => (
                        <TableRow key={city._id}>
                          <TableCell className="font-medium">
                            {city.name}
                          </TableCell>
                          <TableCell>
                            {typeof city.state === "string"
                              ? statesResponse?.data.find(
                                  (s) => s._id === city.state
                                )?.name || city.state
                              : city.state.name}
                          </TableCell>
                          <TableCell>
                            {typeof city.country === "string"
                              ? countriesResponse?.data.find(
                                  (c) => c._id === city.country
                                )?.name || city.country
                              : city.country.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${
                                city.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              } border-none`}
                            >
                              {city.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleOpenCityDialog(city)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          {selectedCountryForCities && selectedStateForCities
                            ? "No cities found"
                            : "Please select both country and state to view cities"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Country Dialog */}
      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? "Edit Country" : "Add New Country"}
            </DialogTitle>
            <DialogDescription>
              {editingCountry
                ? "Update country details for your platform"
                : "Add a new country to your platform"}
            </DialogDescription>
          </DialogHeader>
          <Form {...countryForm}>
            <form
              onSubmit={countryForm.handleSubmit(onCountrySubmit)}
              className="space-y-4"
            >
              <FormField
                control={countryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={countryForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. US" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={countryForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this country on your platform
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    addCountryMutation.isPending ||
                    updateCountryMutation.isPending
                  }
                >
                  {addCountryMutation.isPending ||
                  updateCountryMutation.isPending
                    ? "Saving..."
                    : editingCountry
                    ? "Update Country"
                    : "Add Country"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* State Dialog */}
      <Dialog open={isStateDialogOpen} onOpenChange={setIsStateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingState ? "Edit State" : "Add New State"}
            </DialogTitle>
            <DialogDescription>
              {editingState
                ? "Update state/province details for your platform"
                : "Add a new state/province to your platform"}
            </DialogDescription>
          </DialogHeader>
          <Form {...stateForm}>
            <form
              onSubmit={stateForm.handleSubmit(onStateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={stateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. California" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stateForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countriesResponse?.data.map((country) => (
                          <SelectItem key={country._id} value={country._id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stateForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this state on your platform
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    addStateMutation.isPending || updateStateMutation.isPending
                  }
                >
                  {addStateMutation.isPending || updateStateMutation.isPending
                    ? "Saving..."
                    : editingState
                    ? "Update State"
                    : "Add State"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* City Dialog */}
      <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCity ? "Edit City" : "Add New City"}
            </DialogTitle>
            <DialogDescription>
              {editingCity
                ? "Update city details for your platform"
                : "Add a new city to your platform"}
            </DialogDescription>
          </DialogHeader>
          <Form {...cityForm}>
            <form
              onSubmit={cityForm.handleSubmit(onCitySubmit)}
              className="space-y-4"
            >
              <FormField
                control={cityForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Los Angeles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cityForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset state field when country changes
                        cityForm.setValue("state", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countriesResponse?.data.map((country) => (
                          <SelectItem key={country._id} value={country._id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cityForm.control}
                name="state"
                render={({ field }) => {
                  const selectedCountry = cityForm.watch("country");

                  const filteredStates = statesResponse?.data.filter(
                    (state) => {
                      const countryId =
                        typeof state.country === "string"
                          ? state.country
                          : state.country._id;
                      return countryId === selectedCountry;
                    }
                  );

                  return (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedCountry}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredStates?.map((state) => (
                            <SelectItem key={state._id} value={state._id}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={cityForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this city on your platform
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    addCityMutation.isPending || updateCityMutation.isPending
                  }
                >
                  {addCityMutation.isPending || updateCityMutation.isPending
                    ? "Saving..."
                    : editingCity
                    ? "Update City"
                    : "Add City"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
