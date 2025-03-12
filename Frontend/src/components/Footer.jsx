// Frontend/src/components/Footer.jsx
function Footer() {
    return (
      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>
          Round-Robin Coupon Distribution System &copy; {new Date().getFullYear()}
        </p>
        <p className="mt-2">
          This system distributes coupons in a sequential manner with abuse prevention.
        </p>
      </footer>
    );
  }
  
  export default Footer;