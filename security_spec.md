# Security Specification - VoltFlow Installations

## Data Invariants
- A booking must have a valid name, email, property type, and target date.
- Bookings created via the website must default to 'pending' status.
- `createdAt` is immutable and must be server-time during creation.
- Status changes are restricted to authorized personnel (admins).

## The Dirty Dozen Payloads
1. **Status Injection**: Creating a booking with `status: 'confirmed'`.
2. **Identity Spoofing**: Trying to update `createdAt` after creation.
3. **Invalid Property**: Setting `propertyType` to 'industrial'.
4. **Massive Payload**: Sending a 1MB string for the `name` field.
5. **Unauthorized Read**: Unauthenticated user trying to list all bookings.
6. **Toxic ID**: Using a document ID like `../../../secret`.
7. **Bypassing Server Time**: Providing a client-side timestamp for `createdAt`.
8. **Shadow Field**: Adding `isPromoted: true` to the booking document.
9. **Invalid Email**: Providing `email: "not-an-email"`.
10. **Orphaned Update**: Updating a booking without providing all required fields (if schema enforcement is weak).
11. **Negative Date**: Providing a date in the far past (though hard to enforce strictly in rules without constant `request.time` comparison, we can at least check it's a timestamp).
12. **Unauthorized Delete**: Anonymous user deleting a booking.

## Implementation details
- `isValidBooking` checks all types and sizes.
- `allow create` restricts initial status and time.
- `allow update` and `read` require authenticated and verified users.
