async function UpdateFuelSale() {
  try {
    let uid = url.slice(8, 28); // Assuming the UID is 20 characters long
    const docRef = doc(db, "loan", uid);
    const fuelSaleDoc = await getDoc(docRef);

    if (fuelSaleDoc.exists()) {
      // Get the updated values
      const newFuelLitter = fuel_litter.value;
      const newCustomerName = customer_name.value;
      const newCustomerEmail = customer_email.value;
      const newCustomerPhone = customer_phone.value;
      const newCustomerType = customer_type.value;
      const newPaymentMethod = payment_method.value;

      // Update the "fuelsale" collection only if the fuel_type matches
      if (fuelSaleDoc.data().fuel_type === fuel_type.value) {
        // Calculate the difference in fuel_litter
        const fuelLitterDifference = newFuelLitter - fuelSaleDoc.data().fuel_litter;

        // Update the "fuelsale" collection
        await updateDoc(docRef, {
          fuel_litter: newFuelLitter,
          customer_name: newCustomerName,
          customer_email: newCustomerEmail,
          customer_phone: newCustomerPhone,
          customer_type: newCustomerType,
          payment_method: newPaymentMethod,
          total_price: total_price.value
        });

        // Update the "fuels" collection where fuel_type matches
        const fuelsRef = collection(db, "fuels");
        const fuelsQuerySnapshot = await getDocs(fuelsRef);

        fuelsQuerySnapshot.forEach(async (fuelsDoc) => {
          if (fuelsDoc.data().fuel_type === fuel_type.value) {
            const oldFuelsLitter = fuelsDoc.data().fuel_litter;

            // Calculate the new fuel_litter value for the "fuels" collection
            const newFuelsLitter = oldFuelsLitter - fuelLitterDifference;

            // Update the "fuels" collection with the new fuel_litter value
            await updateDoc(fuelsDoc.ref, {
              fuel_litter: newFuelsLitter
            });
          }
        });

        console.log("Fuel sale updated successfully");
        window.location.href = "view-loans.html";
        alert("Fuel sale updated successfully");
      } else {
        console.log("No matching fuel type!");
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating fuel sale:", error);
  }
}
