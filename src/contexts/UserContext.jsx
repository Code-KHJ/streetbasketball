import React, { createContext, useContext, useEffect, useState } from 'react';
import useSupabase from '@/apis/useSupabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const supabase = useSupabase();

  const [user, setUser] = useState({
    id: null,
    nickname: null,
    phone: null,
    kakaoat: null,
  });

  function convertPhoneFormat(phoneNumber) {
    // 공백, 하이픈, 괄호 제거
    let e164Number = phoneNumber.replace(/\s|-|\(|\)/g, '');
    // 국가 코드가 이미 '+'로 시작하지 않는 경우, '+'를 추가
    if (!e164Number.startsWith('+')) {
      e164Number = '+' + e164Number;
    }
    return e164Number;
  }

  useEffect(() => {
    let subscription;
    if (supabase) {
      subscription = supabase.auth.onAuthStateChange((_event, userdata) => {
        if (_event === 'SIGNED_OUT') {
          setUser({
            id: null,
            nickname: null,
            phone: null,
            kakaoat: null,
          });
        } else if (userdata) {
          setUser((prevUser) => ({
            ...prevUser,
            id: userdata.user.email,
            nickname: userdata.user.user_metadata.full_name,
            phone: userdata.user.user_metadata.phone,
            kakaoat: userdata.provider_token,
          }));

          if (!userdata.user.user_metadata.phone) {
            fetch('https://kapi.kakao.com/v2/user/me', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${userdata.provider_token}`,
              },
            })
              .then((response) => response.json())
              .then(async (data) => {
                if (data.kakao_account.has_phone_number) {
                  const userPhone = convertPhoneFormat(
                    data.kakao_account.phone_number
                  );
                  const { error } = await supabase.auth.updateUser(
                    {
                      data: {
                        phone: userPhone,
                        phone_verified: true,
                      },
                    },
                    {
                      provider: 'kakao',
                    }
                  );
                  if (error) throw error.message;
                }
              })
              .catch((error) => console.log(error));
          }
        }
      });
      return () => {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
      };
    }
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
