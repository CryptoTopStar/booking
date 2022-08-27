import { useState, useEffect } from 'react';
import BookingService from '../services/booking';

// Booking の state と更新ロジックを持つフック
const useBooking = (sub) => {
    const [bookings, setBookings] = useState(null);

    // このカスタムフックを利用しているコンポーネントがマウントされたら Booking を取得する。
    useEffect(() => {
        console.log('sub: %s', sub)

        const fetchAll = async () => {
            const response = await BookingService.list(sub)
            setBookings(response)
        }

        fetchAll()
    }, [sub]);

    const cancel = async (day, time) => {
        console.log('delete key : day = %s, time = %d', day, time)
        await BookingService.cancel(day, time)
    }

    return { bookings, cancel };
};

export default useBooking