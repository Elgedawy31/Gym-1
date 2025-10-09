import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';import { Order } from '@/features/orders/types/orderTypes'
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { View } from 'lucide-react';

type OrdersTableProps = {
  orders: Order[]
  handleStatusChange: (orderId: string, newStatus: string) => void
}

export default function OrdersTable({ orders, handleStatusChange }: OrdersTableProps) {

  return (
    <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Total Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.fullName}</TableCell>
              <TableCell>{order.items?.length}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === 'delivered'
                      ? 'default'
                      : order.status === 'shipped'
                      ? 'outline'
                      : order.status === 'pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className='flex gap-3 items-center'>
                <Link href={`/orders/${order._id}`} >
                  <View />
                </Link>
                <Select
                  onValueChange={(val) => handleStatusChange(order._id, val)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No orders found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
  )
}
