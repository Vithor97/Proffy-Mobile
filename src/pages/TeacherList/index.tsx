import React, { useState } from 'react';

import { View , Text} from 'react-native';
import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-community/async-storage'

import { Feather } from '@expo/vector-icons'
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const [favorites, setFavorites] = useState<number[]>([]);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    const [teachers, setTeachers] = useState([])

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response =>{
            if(response){
                const favoritedTeachers = JSON.parse(response)
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) =>{
                    return teacher.id;
                })

                setFavorites(favoritedTeachersIds)
            }
        });
    }

    useFocusEffect(()=>{
        loadFavorites()
    })



    function handleToggleFilterVisible(){
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFilterSubmit(){
        loadFavorites();
        //executa a api 
        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });

        console.log(response.data)

        setTeachers(response.data)

        //fecha o filtro
        setIsFiltersVisible(!isFiltersVisible);
    }

    return (
        <View style={styles.container}>
            <PageHeader title="Proffys dispiníveis" headerRight={(
                <BorderlessButton onPress={handleToggleFilterVisible}>
                    <Feather name="filter" size={20} color="#FFF"/>
                </BorderlessButton>
            )}>
                { isFiltersVisible && (
                <View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    <TextInput
                        placeholderTextColor="#c1bccc" 
                        style={styles.input}
                        value={subject}
                        onChangeText={ text => setSubject(text)} 
                        placeholder="Qual a matéria"
                    />

                    <View style={styles.inputGroup}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput
                                placeholderTextColor="#c1bccc" 
                                style={styles.input}
                                value={week_day}
                                onChangeText={ text => setWeekDay(text)} 
                                placeholder="Qual o dia?"
                            />
                        </View>

                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput
                                placeholderTextColor="#c1bccc" 
                                style={styles.input}
                                value={time}
                                onChangeText={ text => setTime(text)} 
                                placeholder="Qual horário?"
                            />
                        </View>

                    </View>
                    <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                    </RectButton>
                </View>

                )}
            </PageHeader>

            <ScrollView style={styles.teacherList}
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16
            }}>
                {teachers.map((teacher:Teacher) =>{
                    return (
                        <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)}/>   
                    )
                })}
                
            </ScrollView>
        </View>
    )
}

export default TeacherList;
