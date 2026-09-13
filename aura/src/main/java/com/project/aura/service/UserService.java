package com.project.aura.service;

import com.project.aura.dto.UserDto;
import com.project.aura.entity.User;

import java.util.List;

public interface UserService {
    void saveUser(UserDto userDto);

    User findUserByEmail(String email);

    List<UserDto> findAllUsers();
}
