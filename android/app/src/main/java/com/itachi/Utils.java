package com.itachi;

import android.util.Base64;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

/**
 * Created by bhram on 4/18/2018.
 */

public class Utils {

    public static String decryptIt(String value) {
        try {
            DESKeySpec keySpec = new DESKeySpec("sup3rS3xy".getBytes("UTF8"));
            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
            SecretKey key = keyFactory.generateSecret(keySpec);

            byte[] encrypedPwdBytes = Base64.decode(value, Base64.DEFAULT);
            Cipher cipher = Cipher.getInstance("DES");
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decrypedValueBytes = (cipher.doFinal(encrypedPwdBytes));

            String decrypedValue = new String(decrypedValueBytes);

            return decrypedValue;

        } catch (InvalidKeyException | IllegalBlockSizeException | NoSuchPaddingException | BadPaddingException | NoSuchAlgorithmException | InvalidKeySpecException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return value;
    }
}
