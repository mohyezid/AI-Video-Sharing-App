import {
  View,
  Text,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
RefreshControl;
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";

import { getAllPosts } from "../../lib/appWriteConfig";
import useAppWrite from "../../lib/useAppWrite";

const Home = () => {
  const [refresh, setRefresh] = useState(false);
  const { data: posts, loading, refetch } = useAppWrite(getAllPosts);
  const onRefresh = async () => {
    setRefresh(true);
    await refetch();
    setRefresh(false);
  };
  console.log(posts);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={[{ id: 1 }]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text className="text-3xl text-white">{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6 ">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Mohammed Yezid
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8 ">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={[{ id: 1 }, { id: 2 }, { id: 3 }]} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No Videos Found"}
            subtitle={"Be the first one to upload Video"}
          />
        )}
        refreshControl={
          <RefreshControl refresh={refresh} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
