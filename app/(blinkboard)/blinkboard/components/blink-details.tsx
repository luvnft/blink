import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { toast } from 'react-toastify';

const BlinkDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get the Blink ID from the URL
  const [blink, setBlink] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    // Fetch Blink details from BARK Blink API or state management
    const fetchBlinkDetails = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/v1/blinks/${id}`);
          const data = await response.json();
          setBlink(data);
        } catch (error) {
          console.error("Error fetching blink details:", error);
          toast.error("Failed to load Blink details.");
        }
      }
    };

    fetchBlinkDetails();
  }, [id]);

  const handleStake = async (e) => {
    e.preventDefault();
    try {
      // Add BARK staking logic here
      // Example: await stakeBlink(id, stakeAmount);
      toast.success("Blink staked successfully!");
    } catch (error) {
      console.error("Error staking blink:", error);
      toast.error("Failed to stake Blink.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      // Add your sending logic here
      // Example: await sendBlink(id, recipient);
      toast.success("Blink sent successfully!");
    } catch (error) {
      console.error("Error sending blink:", error);
      toast.error("Failed to send Blink.");
    }
  };

  if (!blink) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card className="mb-4">
        <h2 className="text-xl font-bold">{blink.name}</h2>
        <p>{blink.description}</p>
        <p><strong>Owner:</strong> {blink.owner}</p>
        <p><strong>Created At:</strong> {new Date(blink.createdAt).toLocaleDateString()}</p>
      </Card>

      <div className="space-y-4">
        <form onSubmit={handleStake} className="space-y-4">
          <Label htmlFor="stakeAmount">Amount to Stake</Label>
          <Input 
            id="stakeAmount" 
            type="number" 
            value={stakeAmount} 
            onChange={(e) => setStakeAmount(e.target.value)} 
            required 
          />
          <Button type="submit" className="bg-[#D0BFB4] text-white hover:bg-[#BFA99F] transition-colors">Stake Blink</Button>
        </form>

        <form onSubmit={handleSend} className="space-y-4">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input 
            id="recipient" 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)} 
            required 
          />
          <Button type="submit" className="bg-[#D0BFB4] text-white hover:bg-[#BFA99F] transition-colors">Send Blink</Button>
        </form>

        <Button onClick={() => router.back()} className="bg-gray-500 text-white hover:bg-gray-600 transition-colors">Back</Button>
      </div>
    </div>
  );
};

export default BlinkDetails;
