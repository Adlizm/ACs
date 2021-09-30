package data;

public class ByteBuffer {
    private byte[] data;
    private int index;

    public ByteBuffer(int length){
        this.data = new byte[length];
        this.index = 0;
    }

    public void reset(){
        this.index = 0;
    }
    public byte[] getBytes(){
        return this.data;
    }

    public void put(int value){
        for (int i = Integer.BYTES - 1; i >= 0; i--) {
            data[index + i] = (byte)(value & 0xFF);
            value >>= Byte.SIZE;
        }
        index += Integer.BYTES;
    }
    public void put(double value){
        long valueB = Double.doubleToLongBits(value);
        for (int i = Double.BYTES - 1; i >= 0; i--) {
            data[index + i] = (byte)(valueB & 0xFF);
            valueB >>= Byte.SIZE;
        }
        index += Double.BYTES;
    }
    public void put(boolean value){
        data[index++] = (byte) (value ? 1 : 0);
    }



}
