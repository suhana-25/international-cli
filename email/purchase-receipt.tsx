import { formatCurrency } from '@/lib/utils'
import { Order } from '@/types'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

type OrderInformationProps = {
  order: Order
}

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: '123',
    orderNumber: 'ORD-123456',
    status: 'pending',
    totalAmount: 110,
    itemsPrice: 80,
    taxPrice: 10,
    shippingPrice: 20,
    totalPrice: 110,
    paymentStatus: 'paid',
    paymentMethod: 'Stripe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shippingAddress: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      streetAddress: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      phone: '1234567890',
    },
    items: [
      {
        id: '1',
        orderId: '123',
        productId: '123',
        productName: 'Sample Product',
        quantity: 1,
        price: 100,
        createdAt: new Date().toISOString(),
      }
    ],
  },
} satisfies OrderInformationProps

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.orderNumber}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Purchased On
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(new Date(order.createdAt))}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalAmount)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.items?.map((item) => (
                <Row key={item.productId} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.productName}
                      className="rounded"
                      src="/sample.jpg"
                    />
                  </Column>
                  <Column className="align-top">
                    <Text className="mx-2 my-0">
                      {item.productName} x {item.quantity}
                    </Text>
                  </Column>
                  <Column align="right" className="align-top">
                    <Text className="m-0 ">{formatCurrency(item.price)}</Text>
                  </Column>
                </Row>
              ))}
              {[
                { name: 'Items', price: order.itemsPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalAmount },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}:</Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price || 0)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
