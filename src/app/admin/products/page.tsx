import { Search, Filter, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export default function ProductsPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Product Management</h1>
        {/* <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add New Product
        </Button> */}
      </div>

      <div className='grid gap-6 md:grid-cols-4'>
        <ProductMetricCard
          title='Total Products'
          value='2,543'
          description='Across all vendors'
        />
        <ProductMetricCard
          title='Cakes'
          value='1,245'
          description='All cake products'
        />
        <ProductMetricCard
          title='Gifts'
          value='876'
          description='All gift products'
        />
        <ProductMetricCard
          title='Flowers'
          value='422'
          description='All flower products'
        />
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <Tabs defaultValue='all'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage all products available on the platform
                </CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value='all'>All Products</TabsTrigger>
                <TabsTrigger value='cakes'>Cakes</TabsTrigger>
                <TabsTrigger value='gifts'>Gifts</TabsTrigger>
                <TabsTrigger value='flowers'>Flowers</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4'>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <div className='relative w-full sm:w-[280px]'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search products...'
                  className='w-full pl-8'
                />
              </div>
              <Button variant='outline' size='sm'>
                <Filter className='mr-2 h-4 w-4' />
                Filter
              </Button>
            </div>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <Select defaultValue='all'>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  <SelectItem value='cakes'>Cakes</SelectItem>
                  <SelectItem value='gifts'>Gifts</SelectItem>
                  <SelectItem value='flowers'>Flowers</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='icon'>
                <Download className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-gray-300'
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Category
                  </TableHead>
                  <TableHead>Price</TableHead>

                  <TableHead>Status</TableHead>
                  {/* <TableHead className='text-right'>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <input
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300'
                      />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src='' />
                          <AvatarFallback>
                            {getInitials(product.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{product.name}</div>
                          <div className='text-xs text-muted-foreground'>
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.vendor}</TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {product.category}
                    </TableCell>
                    <TableCell>${product.price}</TableCell>

                    <TableCell>
                      <ProductStatusBadge status={product.status} />
                    </TableCell>
                    {/* <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>
                            <Eye className='mr-2 h-4 w-4' />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className='mr-2 h-4 w-4' />
                            <span>Edit Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash className='mr-2 h-4 w-4' />
                            <span>Delete Product</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-muted-foreground'>
              Showing <strong>1</strong> to <strong>10</strong> of{' '}
              <strong>100</strong> results
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' disabled>
                Previous
              </Button>
              <Button variant='outline' size='sm'>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ProductMetricCardProps {
  title: string
  value: string
  description: string
}

function ProductMetricCard({
  title,
  value,
  description,
}: ProductMetricCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='mt-1 text-xs text-muted-foreground'>{description}</div>
      </CardContent>
    </Card>
  )
}

interface ProductStatusBadgeProps {
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const variants = {
    'in-stock': 'bg-green-100 text-green-800',
    'low-stock': 'bg-yellow-100 text-yellow-800',
    'out-of-stock': 'bg-red-100 text-red-800',
  }

  const labels = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
  }

  return (
    <Badge variant='outline' className={`${variants[status]} border-none`}>
      {labels[status]}
    </Badge>
  )
}

const products = [
  {
    id: '1',
    name: 'Chocolate Cake',
    sku: 'CAKE-001',
    image: '/placeholder.svg?height=40&width=40',
    vendor: 'Ajasco Cakes',
    category: 'Cakes',
    price: '35.99',
    stock: 24,
    status: 'in-stock' as const,
  },
  {
    id: '2',
    name: 'Vanilla Cupcakes (6 Pack)',
    sku: 'CUP-002',
    image: '/placeholder.svg?height=40&width=40',
    vendor: 'Fresh Delights',
    category: 'Cakes',
    price: '12.99',
    stock: 36,
    status: 'in-stock' as const,
  },
  {
    id: '3',
    name: 'Birthday Gift Box',
    sku: 'GIFT-003',
    image: '/placeholder.svg?height=40&width=40',
    vendor: 'Gifting Co.',
    category: 'Gifts',
    price: '49.99',
    stock: 15,
    status: 'in-stock' as const,
  },
  {
    id: '4',
    name: 'Rose Bouquet',
    sku: 'FLOW-004',
    image: '/placeholder.svg?height=40&width=40',
    vendor: 'Bloom Florists',
    category: 'Flowers',
    price: '28.99',
    stock: 8,
    status: 'low-stock' as const,
  },
  {
    id: '5',
    name: 'Red Velvet Cake',
    sku: 'CAKE-005',
    image: '/placeholder.svg?height=40&width=40',
    vendor: 'Ajasco Cakes',
    category: 'Cakes',
    price: '42.99',
    stock: 18,
    status: 'in-stock' as const,
  },
]
