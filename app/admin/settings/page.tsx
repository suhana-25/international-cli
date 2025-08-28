export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Instructions & Documentation</h1>
      <ol className="list-decimal space-y-4 text-lg">
        <li>
          <b>Product Management:</b> <br />
          Go to <b>Admin &rarr; Products</b> to add, edit, or delete statues. Fill all required fields (name, price, weight, images, etc.).
        </li>
        <li>
          <b>Gallery Management:</b> <br />
          Go to <b>Gallery</b> page. As admin, you will see an image upload form. Add image URL and alt text to display new statue images in the gallery.
        </li>
        <li>
          <b>Order Management:</b> <br />
          Go to <b>Admin &rarr; Orders</b> to view, process, and update customer orders. You can mark orders as paid/delivered.
        </li>
        <li>
          <b>User Management:</b> <br />
          Go to <b>Admin &rarr; Users</b> to view all users, update roles, or manage user details.
        </li>
        <li>
          <b>Catalog & Filters:</b> <br />
          Use the <b>Catalog</b> page to see all products. Use filters for price and weight to find specific statues.
        </li>
        <li>
          <b>Profile & Settings:</b> <br />
          Update your admin profile from the <b>Profile</b> page. Change password or personal info as needed.
        </li>
        <li>
          <b>Contact & Support:</b> <br />
          Use the <b>Contact</b> page to send messages or get support. WhatsApp button is available for quick help.
        </li>
      </ol>
      <div className="mt-8 text-base text-gray-500">
        <b>Note:</b> For any technical issues, contact your developer or check the project documentation.
      </div>
    </div>
  )
} 
